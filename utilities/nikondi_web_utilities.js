nikondi.web.create_web_utilities = function () {
    function generate_web_utilities() {
        //code to be ran in ajax data_retrieval_worker worker processes
        function data_retrieval_worker_function() {
            function retrieve_and_forward_data_to_worker_parent(url) {
                //import ajax library into worker
                var nikondi = {
                    web: {
                        navigation_system: {},
                        content_system: {},
                        utilities: {}
                    }
                };
                nikondi.web.utilities.ajax = {
                    get_remote_data: function (url, callback) {
                        var remote_request = new XMLHttpRequest();
                        remote_request.onload = function () {
                            callback(remote_request.responseText)
                        };
                        //open and send request, XMLHttpRequest is not garbage collected whiile in open or send state, per stardard
                        remote_request.open("get", url, true);
                        remote_request.send();
                    }
                };
                //worker response on the ajax load (data fully downloaded) event
                function forward_data_to_worker_parent(data) {
                    self.postMessage(data);
                }
                //get data and process response
                nikondi.web.utilities.ajax.get_remote_data(url, forward_data_to_worker_parent);
            }
            //process worker event each time the worker gets called
            self.onmessage = function (event) {
                retrieve_and_forward_data_to_worker_parent(event.data);
            };
        }
        return {
            dom: {
                remove_all_children: function (element) {
                    while (element.hasChildNodes()) {
                        element.removeChild(element.firstChild);
                    }
                },
                create_dom_element: function (str_type, str_id, arr_classes, str_inner_html) {
                    //build div button by extracting name, id, classes from button_object
                    var elem;
                    elem = document.createElement(str_type);
                    elem.id = str_id;
                    elem.innerHTML = str_inner_html;
                    //add classes
                    for (var index in arr_classes) {
                        elem.className += " " + arr_classes[index];
                    }
                    return elem;
                },
                create_dom_image: function (str_title, str_src, str_alt, str_id, str_classes) {
                    var elem_img = nikondi.web.utilities.dom.create_dom_element("img", str_id, str_classes, "");//try null for innerhtml
                    if (str_title) {
                        elem_img.title = str_title;
                    }
                    if (str_src) {
                        elem_img.src = str_src;
                    }
                    if (str_alt) {
                        elem_img.alt = str_alt;
                    }
                    return elem_img;
                }
            },
            workers: {
                create_generic_worker_with_function: function (worker_function) {
                    //create function blob. The blob constructor concatenates the data
                    //in each array value. toString() is used on the function because
                    //quotes would otherwise need to be escaped
                    var worker_function_blob = new Blob(["(",
                        worker_function.toString(),
                        ")()"]);
                    //create a url that points to the function blob
                    var worker_url = URL.createObjectURL(worker_function_blob);
                    console.log("worker url is " + worker_url);
                    //create the worker
                    var web_worker = new Worker(worker_url);
                    return web_worker;
                },
                create_generic_worker_with_function_and_callback: function (worker_function, callback) {
                    //create the worker
                    var web_worker = nikondi.web.utilities.workers.create_generic_worker_with_function(worker_function);
                    //extract worker response with proxy function, then pass data to response_processing_function
                    web_worker.onmessage = function (event) {
                        callback(event.data);
                    };
                    return web_worker;
                },
                create_data_retrieval_worker: function () {
                    //create worker process with a worker function and response function
                    var web_worker = nikondi.web.utilities.workers.create_generic_worker_with_function(data_retrieval_worker_function);
                    return web_worker;
                },
                create_data_retrieval_worker_with_callback: function (callback) {
                    //create worker process with a worker function and response function, data_retrieval_worker_function accessible via closure mechanism
                    var web_worker = nikondi.web.utilities.workers.create_generic_worker_with_function_and_callback(data_retrieval_worker_function, callback);
                    return web_worker;
                }
            },
            ajax: {
                get_remote_data: function (url, callback) {
                    var remote_request = new XMLHttpRequest();
                    remote_request.onload = function (event) {
                        callback(remote_request.responseText);
                    };
                    //open and send request, XMLHttpRequest is not garbage collected while in open or send state, per stardard
                    remote_request.open("get", url, true);
                    remote_request.send();
                },
                create_ajax_manager: function () {
                    //dummy element to get EventTarget interface
                    var ajax_manager = document.createElement('div')
                    ajax_manager.str_response_data = "";
                    ajax_manager.get_remote_data = function(url) {
                            var remote_request = new XMLHttpRequest();
                            remote_request.onload = function (event) {
                                ajax_manager.str_response_data = remote_request.responseText;
                                var event_downloaded_data_available = new Event("downloaded_data_available");
                                ajax_manager.dispatchEvent(event_downloaded_data_available);
                            };                            
                            //XMLHttpRequest is not garbage collected while in open or send state, per stardard
                            remote_request.open("get", url, true);
                            remote_request.send();
                    };
                    return ajax_manager;                                       
                }
            }
        };
    }
    nikondi.web.utilities = generate_web_utilities();
};


