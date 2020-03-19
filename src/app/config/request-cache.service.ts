
import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

import { MessageService } from './message.service';
import { AppSettings } from '../app.settings';

export interface RequestCacheEntry {
    url: string;
    response: HttpResponse<any>;
    lastRead: number;
}

export abstract class RequestCache {
    abstract get(req: HttpRequest<any>): HttpResponse<any> | undefined;
    abstract put(req: HttpRequest<any>, response: HttpResponse<any>): void
}

const maxAge = 20000; // maximum cache age (ms)

@Injectable()
export class RequestCacheWithMap implements RequestCache {

    cache = new Map<string, RequestCacheEntry>();

    constructor(private messenger: MessageService, public appSettings: AppSettings) { }

    get(req: HttpRequest<any>): HttpResponse<any> | undefined {
   
        const url = req.urlWithParams;
        const cached = this.cache.get(url);
        if (!cached) {
            return undefined;
        }

        let isExpired = cached.lastRead < (Date.now() - maxAge);
       
        const expired = isExpired ? 'expired ' : '';

        // if(this.appSettings.settings.clearChache)
        // isExpired=true;

        this.messenger.add(
            `Found ${expired}cached response for "${url}".`);
        return isExpired ? undefined : cached.response;
    }

    put(req: HttpRequest<any>, response: HttpResponse<any>): void {
        //console.log("Cahing PUT request")
        const url = req.urlWithParams;
        this.messenger.add(`Caching response from "${url}".`);

        const entry = { url, response, lastRead: Date.now() };
        this.cache.set(url, entry);

        // remove expired cache entries
        const expired = Date.now() - maxAge;
        this.cache.forEach(entry => {
            if (entry.lastRead < expired) {
                this.cache.delete(entry.url);
            }
        });

        this.messenger.add(`Request cache size: ${this.cache.size}.`);
    }
}
