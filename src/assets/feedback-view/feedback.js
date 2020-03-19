var empId;
var htmlId;
var empName;
var initial=false;


//var urladdress='http://192.168.5.184:8083'
   var urladdress= 'http://192.168.12.171:8083/Feedback/api'
   // var urladdress='https://qj2ee01.quest-global.com/Feedback/api';
function calculateRating(value){
    $(".remarksrow").hide();
    $("#starerrormsg").hide();
    $("#currentratingsmiley").attr('src', 'assets/feedback-view/img/' +value+ '.png');
    document.getElementById("myrating").innerHTML="Rating - "+value;
    document.getElementById("ratings").value=value;
    if(value <3){
        $(".remarksrow").show();
    }
}



function feedback(divid,empNumber,appNumber,name){  
   
            empId=empNumber;    
            appId=appNumber;
            htmlId=divid;
            empName=name;
        $.ajax({
            type : 'GET',
            url : urladdress+'/isgivenfeedback/'+empId+'/'+appId,
            async : true,
            cache: false,
            /*
             headers : {
                 'Access-Control-Allow-Origin' : '*',
                 "access-control-allow-headers" : "*"
             },
             */
            success : function(data) {
              
                createHtmlView(data);
            },
            error : function(data) {
           
            }
        });
       }   
      
   

    function createHtmlView(data){
        if(!initial){
            $("#"+htmlId).html('<div class="modal fade" id="feedbackModal" role="dialog"> <div class="modal-dialog"> <div class="modal-content"><div class="modal-header chartPanelHeader top-navbar"> <h4 class="modal-title">'+data.appDetails.applicationName+ '- Feedback</h4>  <button type="button" class="close" onclick="closeModal()" data-dismiss="modal">&times;</button>   </div> <div id="modal-body-test" class="modal-body"> </div> </div> </div>');
        }
        $('#feedbackModal').modal({backdrop: 'static', keyboard: false})   
     
        if(data.chartData != undefined){ 
            $("#modal-body-test").html('<table align="center" style=" border-spacing: 0px;">	<tr ><td id="finalratingimage" ><img id="overallavg" src="" alt="image not set"><br><span id="finaloverallavg"></span>           </td><td style="width:500px;margin-left:0px;"><div id="chartdiv"></div></td></tr></table>  <div  id="myRating" align="center">My Rating -'+data.userfeedback.ratings+'</div><div id="myRatingstars" align="center"></div><div id="myRatingsmiley"></div> <div id="suggestion" align="center"><input type="text" hidden  id="empId" value="'+empId+'"><input type="text"   id="appId" hidden value="'+appId+'"><h5 align="center" style="font: bolder;color: green;display:none;" id="suggetiongreetingmsg" >Thank you for giving suggestions</h5>   <table><tr>							<td><div class="col-lg-12"><h4>Suggestions:</h4> <span style="font-weight: bolder;font-size: 10px;color: red;display: none;" id="errormsg">*required</span></div></td>						        </tr><tr> <td > <div class="col-lg-12"><textarea id="suggestions" cols="60" rows="3" class="form-control"></textarea></div></td></tr><tr> <td align="right"><div class="col-lg-12"><button onclick="saveSuggetions()" class="btn btn-sm btn-success top-navbar" >Submit</button></div></td> </tr>  </table>')  
            createFeedbackChart(data.chartData);   
            if(data.userfeedback.ratings === 1){
                $("#myRatingstars").html('<span><span class="fa fa-star fa-2x checked"></span> <span class="fa fa-star fa-2x unchecked"></span> <span class="fa fa-star fa-2x unchecked"></span> <span class="fa fa-star fa-2x unchecked"></span><span class="fa fa-star fa-2x unchecked"></span>  </span>')
            }else if(data.userfeedback.ratings === 2){
                $("#myRatingstars").html('<span><span class="fa fa-star fa-2x checked"></span> <span class="fa fa-star fa-2x checked"></span> <span class="fa fa-star fa-2x unchecked"></span> <span class="fa fa-star fa-2x unchecked"></span><span class="fa fa-star fa-2x unchecked"></span>  </span>')
            }else if(data.userfeedback.ratings === 3){
                $("#myRatingstars").html('<span><span class="fa fa-star fa-2x checked"></span> <span class="fa fa-star fa-2x checked"></span> <span class="fa fa-star fa-2x checked"></span> <span class="fa fa-star fa-2x unchecked"></span><span class="fa fa-star fa-2x unchecked"></span>  </span>')
            }else if(data.userfeedback.ratings === 4){
                $("#myRatingstars").html('<span><span class="fa fa-star fa-2x checked"></span> <span class="fa fa-star fa-2x checked"></span> <span class="fa fa-star fa-2x checked"></span> <span class="fa fa-star fa-2x checked"></span><span class="fa fa-star fa-2x unchecked"></span>  </span>')
            }else{
                $("#myRatingstars").html('<span><span class="fa fa-star fa-2x checked"></span> <span class="fa fa-star fa-2x checked"></span> <span class="fa fa-star fa-2x checked"></span> <span class="fa fa-star fa-2x checked"></span><span class="fa fa-star fa-2x checked"></span>  </span>')
            }  
           
        }else{
            $("#modal-body-test").html('<div id="rating" align="center"> <br><img  id="currentratingsmiley" src="" ><br><h5 style="display:none;color:red;"id="starerrormsg">Rating can not be zero</h5><div id="starscheck" class="stars" ><input onchange="calculateRating(this.value)"  class="star star-5" id="5" type="radio" name="star" value="5" /><label class="star star-5" for="5"></label> <input onchange="calculateRating(this.value)" class="star star-4" id="star-4" type="radio" name="star" value="4" /><label class="star star-4" for="star-4" path="ratings"></label> <input onchange="calculateRating(this.value)" class="star star-3" id="star-3" type="radio" name="star" value="3" /> <label class="star star-3" for="star-3" path="ratings"></label> <input onchange="calculateRating(this.value)" class="star star-2" id="star-2" type="radio" name="star" value="2" /> <label class="star star-2" for="star-2" path="ratings"></label> <input onchange="calculateRating(this.value)" class="star star-1" id="star-1" type="radio" name="star" value="1" />  <label class="star star-1" for="star-1" path="ratings"></label>  </div>          <br><h5 id="myrating"></h5></div> <input type="number" hidden="true"  id="ratings" name="ratings" />          <div id="feedbackdata"><input type="text" hidden id="empId" value="'+empId+'"><input type="text" hidden  id="appId" value="'+appId+'"><div align="center"><table>	<tr><td class="remarksrow" style="display:none;"><h4>Remarks:</h4><span style="font-weight: bolder;font-size: 10px;color: red;display: none;" id="errormsg">*required</span></td> </tr>  <tr align="center" class="remarksrow" id="remarksrow" style="display:none;"><td> <textarea class="form-control" id="remarks" cols="60" rows="3"></textarea></td></tr>           <tr><td><h4>Suggestions:</h4></td></tr>  <tr align="center"> <td> <textarea class="form-control" id="suggestions" cols="60" rows="3"></textarea></td></tr> <tr> <td align="right"> <button type="button" onclick="saveFeedback()" class="btn btn-sm btn-success top-navbar">Submit</button></td> </tr>  </table></div></div>             </div>    </div></div></div>') 
            
        }
      
        if(!initial){
            $("#feedbackModal").modal('show');
            initial=true;
        }
     
    }

    
    function closeModal(){
    	$("#feedbackModal").modal('toggle');
        $("#feedbackModal").detach();
        initial=false;
    }

    

    function createFeedbackChart(data){
        var overallAverage = 0;
        var average = 0;
        var count = 0;
        for (var i = 0; i < data.length; i++) {
            count += data[i].ratingCount;
            average += data[i].overallAverage;
        }
        overallAverage = Math.round((average / count));
            $("#overallavg").attr('src', 'assets/feedback-view/img/' + Math.round((average / count)) + '.png');
            document.getElementById("finaloverallavg").innerHTML= ((average / count).toFixed(2));
            
        AmCharts.addInitHandler(function(chart) {
    
            for (var i = 0; i < chart.graphs.length; i++) {
                var graph = chart.graphs[i];
                if (graph.autoColor !== true)
                    continue;
                var colorKey = "autoColor-" + i;
                graph.lineColorField = colorKey;
                graph.fillColorsField = colorKey;
                var colorChart=["#57bb8a","#9ace6a","#ffcf02","#ff9f02","#ff6f31"];
                for (var x = 0; x < chart.dataProvider.length; x++) {
                    var color = colorChart[x];
                    chart.dataProvider[x][colorKey] = color;
                }
            }
    
        }, [ "serial" ]);
    
        var chart = AmCharts.makeChart("chartdiv", {
            "type" : "serial",
            "theme" : "light",
            "rotate" : true,
            "autoMarginOffset" : 15,
            "marginBottom" : 10,
            "dataProvider" : data,
            "startDuration" : 1,
            "columnWidth" : 0.8,
            "startDuration": 1,
            "valueAxes" : [ {
                "stackType": "regular",
                "axisAlpha" : 0,
                "gridAlpha" : 0,
                "gridColor" : "#FFFFFF",
                "gridCount":5,
                "labelsEnabled" : false,
                "dashLength" : 0,
                 "totalText": "[[ratingCount]]"
            } ],
    
            "graphs" : [ {
                "autoColor" : true,
                "balloonText" : "Total:<b>[[value]]</b>",
                "fillAlphas" : 0.9,
                "lineAlpha" : 0.2,
                "type" : "column",
                "valueField" : "ratingCount",
                "fixedColumnWidth": 20,
                "maxColumnLength":30
                
            } ],
    
            "categoryField" : "rating",
            "categoryAxis" : {
                "inside" : false,
                "gridPosition" : "middle",
                "gridAlpha" : 0,
                "tickPosition" : "start",
                "tickLength" : 0,
                "labelOffset" : 5,
                "boldLabels" : true,
                "equalSpacing" : true,
                "totalText":"[[rating]]"
            },
             
        });
    
    
    }

    function saveFeedback(){
     
      var ratings=document.getElementById("ratings").value;
      var remarks=document.getElementById("remarks").value;
      var suggestions=document.getElementById("suggestions").value;
      var appId=document.getElementById("appId").value;
      var empId=document.getElementById("empId").value;
     
        if(ratings == ""){
           
           $("#starerrormsg").show();
        }

     if(ratings <3 && remarks ==""){
        $("#remarks").css('border-color', ' #8b0000');
        $("#errormsg").show();
     }else{
        $.ajax({
            type : 'POST',
            url : urladdress+'/savefeedback',
            async : true,
            cache: false,
            contentType : 'application/json',
            /*
            headers : {
                'Access-Control-Allow-Origin' : '*',
                "access-control-allow-headers" : "*"
            },
            */
            data:JSON.stringify({
                    "ratings":ratings,
                    "remarks":remarks,
                    "empName":empName,
                    "suggestions":suggestions,
                    "appId":appId,
                    "empId":empId,
                    
            }),
            success : function(data) {
           	 //$("#feedbackModal").modal('toggle');
            //  $("#feedbackModal").detach();
           
                createHtmlView(data);
             
            },
            error : function(data) {
             //  alert("error")
            }
        });
     }
    }

    function saveSuggetions(){
        var suggestions=document.getElementById("suggestions").value;
        var appId=document.getElementById("appId").value;
        var empId=document.getElementById("empId").value;

        if(suggestions == ""){
            $("#suggestions").css('border-color', ' #8b0000');
            $("#errormsg").show();
        }else{
            $.ajax({
                type : 'POST',
                url : urladdress+'/saveSuggetion',
                async : true,
                cache: false,
                contentType : 'application/json',
                /*
                headers : {
                    'Access-Control-Allow-Origin' : '*',
                    "access-control-allow-headers" : "*"
                },
                */
                data:JSON.stringify({
                        
                        "suggestions":suggestions,
                        "appId":appId,
                        "empId":empId,
                        "empName":empName
                }),
                success : function(data) {
                	 document.getElementById("suggestions").innerHTML="";
                    $("#suggetiongreetingmsg").show();
                  
                    
                },
                error : function(data) {
                    
                }
            });
        }


    }