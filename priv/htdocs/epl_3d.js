$(document).ready(function() {
    var socket;

    if(!("WebSocket" in window)) {
        $('<p>Oh no, you need a browser that supports WebSockets.'+
          'How about <a href="http://www.getfirefox.com/">Mozilla Firefox</a>?'+
          '</p>').appendTo('#epl_3d');
    } else {
        //
        //The user has WebSockets
        //
        function connect(){
            var host = "ws://"+window.location.hostname+":"+
                window.location.port+"/epl_3d_EPL";
            try{
                socket = new WebSocket(host);
                message('3D WebSocekt: new');

	        socket.onopen = function(){
	            message('3D WebSocekt: open');
	        }

	        socket.onmessage = function(msg){
                    d = JSON.parse(msg.data);

                    var default_node = {size:3,
                                        color: 0x77bbFF,
                                        opacity: 0.5};
                    var exit_node = {size:2,
                                     color: 0x777777,
                                     opacity: 0.7};
                    var default_edge = { sizeS: 0.9,
                                         sizeT: 0.9,
                                         color: 0x888888,
                                         opacity: 1 };

                    if(d.spawn  != undefined) {
                        d.spawn.forEach(function(item) {
                            VE.setNode(item.id, default_node);
                        });
                    };

                    if(d.send  != undefined) {
                        d.send.forEach(function(item) {
                            VE.setNode(item.v1, default_node);
                            VE.setNode(item.v2, default_node);
                            VE.setEdge(item.v1, item.v2, default_edge);
                        });
                    };

                    if(d.receive != undefined) {
                        d.receive.forEach(function(item) {
                            VE.setNode(item.id, {size: Math.log(item.c+1),
                                                 color: 0xFF7777,
                                                 opacity: 0.8 });
                        });
                    };

                    if(d.exit  != undefined) {
                        d.exit.forEach(function(item) {
                            VE.setNode(item.id, exit_node);
                        });
                    };

                    if(d.topic === "process-info") {
                        $('#process_info').html(JSON.stringify(d.data, undefined, 2));
                    };
                }

	        socket.onclose = function(){
	            message('3D WebSocekt: closed');
	        }

	    } catch(exception){
	        message(exception);
	    }

	    function message(msg){
	        $('#message').text(msg);
            }//End message()

        }//End connect()

    }//End else

    connect();

    VE.initialize('epl_3d', { transparency: true });
    VE.onNodeSelect = function onSelect(nodeId) {
        VE.focusNode(nodeId);
        socket.send(nodeId);
    }

});
