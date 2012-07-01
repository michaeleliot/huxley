    
    var ContentManager = {
		
		advisorManagers: [],
		chairManagers: [],
		
		/* Initializer function */
		init: function(){
			$(window).bind('hashchange', function(){
		        var newHash = window.location.hash.substring(1);
		        
		        if($("#app").is(":hidden")){
		            ContentManager.loadInitContent(newHash);
		        }
		        else {
		            ContentManager.loadNewContent(newHash);
		        }
   	 		});
			
			$("#container").delegate("a.nav", "click", function(){
            	window.location.hash = $(this).attr('href');
            	return false;
        	});
			
			$("#container").delegate("#appnavbar a.nav", "click", function(){
            	$("#appnavbar a.nav.currentpage").removeClass('currentpage');
            	$(this).addClass('currentpage');
        	});
			
			ContentManager.onPageLoad();
		},
		
        /* Fades the initial content into view. */
        onPageLoad: function(){
            if(window.location.hash == ""){
                if(window.location.pathname == "/"){
                    if($("#app.authentication").length > 0){
                        window.location.href = "/#/login";
                    }
                    else if ($("span.usertype span").attr("usertype") == "advisor"){
                        window.location.href = "/#/advisor/welcome";
                    }
                    else if ($("span.usertype span").attr("usertype") == "chair"){
                        window.location.href = "/#/chair/grading";
                    }
                }
                else{
                    window.location.href = "/#" + window.location.pathname.substring(0, window.location.pathname.length -1);
                }
            }
            else{
                ContentManager.triggerHashChange();
            }
        },
        
        /* Loads initial content into the application content container.*/
        loadInitContent: function(hash, data){
			ContentManager.initializeManagers();
            if($("#splash").is(":visible")){
                $(".content #contentwrapper").load(hash + " #capsule", data, function(){
					$("#appnavbar a[href='" + window.location.hash.substring(1) + "']").addClass('currentpage');
                    $("#splash").delay(250).fadeOut(250, function(){
                        $("#app").delay(250).fadeIn(500, function(){
                            $("#headerwrapper").slideDown(350, function(){
                                $("#header").slideDown(350);
                            });
                        });
                    });
                });
            }
            else{
                $(".content #contentwrapper").load(hash + " #capsule", data, function(){
                    $("#app").delay(250).fadeIn(500);
                });
            }
        },
        
        /* Loads new content into the application content container. */
        loadNewContent: function(hash, data){
            $(".content").css('height', $(".content").height() + "px");
            $(".content #contentwrapper").fadeOut(150, function(){
                $(".content #contentwrapper").load(hash + " #capsule", data, function(response, status, xhr){
                    if(status == 'error') { 
                    	/*$("#modal").modal({
                    		overlayClose: true,
                    		opacity: 50,
                    		overlayCss: {backgroundColor:"#000000"},
                    		containerCss: {backgroundColor:"#000000"},
                    		dataCss: {color:"#FFFFFF"}
                    	});*/
                    	alert("Sorry, there was an error.");
                    	parent.history.back();
                    };
                    $("#contentwrapper").css({'visibility':'hidden', 'display': 'block'});
                    var height = $("#contentwrapper").height();
                    $("#contentwrapper").css({'visibility':'', 'display': 'none'});
                    $(".content").animate({height: height}, 500, function(){
                            $("#contentwrapper").fadeIn(150, function(){
                                    $(".content").css('height','');
                            });
                    });
                });
            });
        },
        
		/* Loads in the new app frame upon login*/
		onLogin: function(){
			$("#container").fadeOut(150, function(){
				$("#container").load("/ #appcontainer", null, function(){
					$("#container").fadeIn(250, function(){
						if ($("span.usertype span").attr("usertype") == "advisor"){
                        	window.location.href = "/#/advisor/welcome";
	                    }
	                    else if ($("span.usertype span").attr("usertype") == "chair"){
	                        window.location.href = "/#/chair/grading";
	                    }
					});
				});
			});
		},
		
		onLogout: function(){
      		$("#container").fadeOut(250, function(){
          		$("#container").load("/login/ #appcontainer", null, function(){
              		$("#container").css("display","");
              		window.location.href = "/#/login";
              		$("#app").delay(250).fadeIn(250);
          		});
      		});
		},
		
        /* Triggers a hash change event. */
        triggerHashChange: function(){
            $(window).trigger('hashchange');
        },
		
		/* Initializes all the managers in the advisorManagers array */
		initializeManagers: function(){
			var managers;
			type = $("span.usertype span").attr("usertype");
			if (type == "advisor"){
				managers = ContentManager.advisorManagers;	
			}
			else if (type == "chair"){
				managers = ContentManager.chairManagers;
			}
			else {
				managers = [];
			}
			for(var i = 0; i < managers.length; i++){
				managers[i].init();
			}
		}
        
    };
    
    $(function(){
		ContentManager.init();
    });
