nikondi.web.start_content_system = function () {
    function create_content_system() {        
        //return elem_content_container
        function create_content_container(){
            var content_container = nikondi.web.utilities.dom.create_dom_element("div","content_system__main_content", "", "");
            return content_container;
        }   
        //returns void
        function add_content_container_to_DOM(elem_content_container) {
            document.body.insertBefore(elem_content_container, document.body.firstChild);
        }        
        //returns void, processes response from worker on message event
        function add_content_data_to_content_container(json_array_content_data,elem_content_container) {
            //remove existing content, if present
            //relies on nikondi.web.utilities
            nikondi.web.utilities.dom.remove_all_children(elem_content_container);
            //parse json object and create and attach HTML elements. The elements are populated by the json data
            var array_articles = JSON.parse(json_array_content_data).data;
            for (var i = 0; i < array_articles.length; i++) {
                var elem_paragraph = nikondi.web.utilities.dom.create_dom_element("div","", ["article_paragraph"], "");
                var elem_paragraph_title = nikondi.web.utilities.dom.create_dom_element("div","", ["article_paragraph_title"], array_articles[i].title);
                var elem_paragraph_value = nikondi.web.utilities.dom.create_dom_element("div","", ["article_paragraph_value"], array_articles[i].value);
                elem_paragraph.appendChild(elem_paragraph_title);
                elem_paragraph.appendChild(elem_paragraph_value);
                elem_content_container.appendChild(elem_paragraph);
            }
        }
        //returns web_worker
        function create_content_system_persistent_worker(elem_content_container){
            //create worker that retrieves data from a passed in URL and sends response to given response function
            var web_worker = nikondi.web.utilities.workers.create_data_retrieval_worker_with_callback(function(response){add_content_data_to_content_container(response,elem_content_container)});
            return web_worker;
        }       
        var content_container = create_content_container();
        var worker = create_content_system_persistent_worker(content_container);        
        add_content_container_to_DOM(content_container);        
        //Return content_system object interface, contains closures   
        return {
            //closure
            load_remote_content_into_DOM: function (url_of_content) {
                content_container.innerHTML = "Loading page...";
                //trigger worker to fetch data from a server
                worker.postMessage(url_of_content);
            }
        };
    }
    nikondi.web.content_system = create_content_system();
};