nikondi.web.start_navigation_system = function () {
    //location of the json file mapping links to content urls, suporting file system flexibility
    var link_to_content_mapping = "http://localhost:8383/nikondi_website_dev/mobile5/navigation_system/javascript/link_to_content_mapping.json";
    
    //return elem_main_container
    function create_main_container() {
        var elem_main_container = nikondi.web.utilities.dom.create_dom_element("nav", "navigation_system", "", "");
        return elem_main_container;
    }
    //return elem_background
    function create_background() {
        var elem_background = nikondi.web.utilities.dom.create_dom_element("div", "navigation_system_background", ["navigation_system"], "");
        return elem_background;
    }
    //return elem_menu_container
    function create_menu_container() {
        var elem_menu_container = nikondi.web.utilities.dom.create_dom_element("div", "navigation_system_menu_container", ["navigation_system"], "");
        return elem_menu_container;
    }
    //return elem_top_bar_container
    function create_top_bar_container() {
        var elem_top_bar_container = nikondi.web.utilities.dom.create_dom_element("div", "navigation_system_top_bar", ["navigation_system"], "");
        return elem_top_bar_container;
    }
    //return elem_logo    
    function create_logo() {
        var elem_logo = nikondi.web.utilities.dom.create_dom_image(null, "navigation_system/images/nikondi_logo.svg", "", "navigation_system_main_logo", ["navigation_system"]);
        return elem_logo;
    }
    //return elem_top_bar_menu_bars
    function create_menu_bars() {
        var elem_menu_bars = nikondi.web.utilities.dom.create_dom_image(null, "navigation_system/images/menu_bars_gray.svg", "", "navigation_system_menu_bars", ["navigation_system"]);
        return elem_menu_bars;
    }

    //return void
    function add_main_container_to_DOM(elem_main_container) {
        document.body.insertBefore(elem_main_container, document.body.firstChild);
    }
    //return void
    function add_background_to_DOM(elem_main_container, elem_background) {
        elem_main_container.appendChild(elem_background);
    }
    //return void
    function add_menu_container_to_DOM(elem_main_container, elem_menu_container) {
        elem_main_container.appendChild(elem_menu_container);
    }
    //return void
    function add_top_bar_container_to_DOM(elem_main_container, elem_top_bar_container) {
        elem_main_container.appendChild(elem_top_bar_container);
    }
    //return void
    function add_logo_to_DOM(elem_top_bar_container, elem_logo) {
        elem_top_bar_container.appendChild(elem_logo);
    }
    //return void
    function add_menu_bars_to_DOM(elem_top_bar_container, elem_menu_bars) {
        elem_top_bar_container.appendChild(elem_menu_bars);
    }

    //return void
    function toggle_menu_state(elem_menu_container, elem_background) {
        var int_non_existant = -1;
        //if nav menu is selected, unselect it on a click,
        //if not selected, add selected class to trigger CSS.
        elem_menu_container.className.indexOf('selected') !== int_non_existant ?
                (function () {
                    elem_menu_container.className = elem_menu_container.className.replace('selected', '');
                    elem_background.className = elem_background.className.replace('visible', '');
                })()
                :
                (function () {
                    elem_menu_container.className += ' selected';
                    elem_background.className += ' visible';
                })();
    }

    //return void
    function add_event_listeners_to_background(elem_menu_container, elem_background) {
        elem_background.addEventListener("click", function (event) {
            toggle_menu_state(elem_menu_container, elem_background);
        });
    }
    //return void
    function add_event_listeners_to_menu_bars(elem_menu_container, elem_menu_bars, elem_background) {
        elem_menu_bars.addEventListener("click", function (event) {
            toggle_menu_state(elem_menu_container, elem_background);
        });
    }

    //return void
    function download_and_process_menu_buttons(elem_menu_container, elem_background) {
        //return elem_button
        function create_menu_button_element(obj_button) {
            var elem_button = nikondi.web.utilities.dom.create_dom_element("div", obj_button.id, obj_button.classes, obj_button.name);
            return elem_button;
        }
        function add_menu_button_to_DOM(elem_button_with_listener, elem_menu_container) {
            elem_menu_container.appendChild(elem_button_with_listener);
        }
        //return elem_button_with_listener,
        //this is the same object as the input data, but by changing returned data type, the intended function order is made intuitive
        //and if a type system existed in javascript, it would be enforced with parameter types in function definitons
        function add_event_listener_to_menu_button(elem_button, json_button, elem_menu_container, elem_background) {
            elem_button.addEventListener("click", function (event) {
                nikondi.web.content_system.load_remote_content_into_DOM(json_button.url);
                toggle_menu_state(elem_menu_container, elem_background);
            });
            var elem_button_with_listener = elem_button;
            return elem_button_with_listener;
        }
        function process_downloaded_json_menu_buttons(json_buttons_data, elem_menu_container, elem_background) {
            var array_obj_buttons = JSON.parse(json_buttons_data);
            var index;
            for (index in array_obj_buttons) {
                var DOM_button = create_menu_button_element(array_obj_buttons[index]);
                var DOM_button_with_listener = add_event_listener_to_menu_button(DOM_button, array_obj_buttons[index], elem_menu_container, elem_background);
                add_menu_button_to_DOM(DOM_button_with_listener, elem_menu_container);
            }

        }
        var ajax_manager = nikondi.web.utilities.ajax.create_ajax_manager();
        ajax_manager.addEventListener("downloaded_data_available", function (event) {
            process_downloaded_json_menu_buttons(ajax_manager.str_response_data, elem_menu_container, elem_background);
        });
        ajax_manager.get_remote_data(link_to_content_mapping);
    }

    //return void
    function create_navigation_system() {
        //create DOM elements
        var main_container = create_main_container();
        var background = create_background();
        var menu_container = create_menu_container();
        var top_bar_container = create_top_bar_container();
        var logo = create_logo();
        var menu_bars = create_menu_bars();
        //add elements to DOM
        add_main_container_to_DOM(main_container);
        add_top_bar_container_to_DOM(main_container, top_bar_container);
        add_logo_to_DOM(top_bar_container, logo);
        add_menu_bars_to_DOM(top_bar_container, menu_bars);
        add_menu_container_to_DOM(main_container, menu_container);
        add_background_to_DOM(main_container, background);
        //attach listeners to DOM elements
        add_event_listeners_to_background(menu_container, background);
        add_event_listeners_to_menu_bars(menu_container, menu_bars, background);
        //handle buttons
        download_and_process_menu_buttons(menu_container, background);
    }

    create_navigation_system();
};






//I want navigation system to use a worker for ajax

//take a look for proxy functions throughout program

//indexDB for content system key-to-url query system, to abstract file system placement of files, from code. Global data structure, and the only location,
//that needs updating, should there be a file system change. Possibly not even in content system, a seperate system in itself

//nikondi.web.utilities.dom.add_class(DOM_element, class)

//add create_block_scope function to utilities

//consider wrapping new navigation_system in closure like content system

//parameter types in function definitions throughout program

//data structure that guides order of script file execution

//an array of workers, possible through a ajax module that can be shared by the system, through a queue, 
//with each worker being used in a round-robin fashion etc 

//make content_system top level container and content_system_main_content inside, do all in javascript

//module loader using eval

//rebuild content_system to not use getElementByID and instead passed in parameters

//write navigation_system to be a OOP and prodecural hybrid

//programmatically draw SVG of nikondi as intro to dev site

//css transforms for mid content image sliders

//C# worker and form processor

//customer form

//drag and drop user info and picture, store in local storage.

//c# cookie processor for server-side user info

//MVC design, with user agent detection and conditional loading html and css and javascript view (MVC) code. Media queries for small differences in screen size. 2 main views,
//orr all through css media queries as css file link attributes for conditional css loading, then hide and augment visuals, but share HTML and js code with desktop.

//Share controllers and models for mobile and desktop site.

//wrapper function for common dom tasks, and other common tasks, for better readibility.

//have system add their css files.

//rebuild site to follow MVC, have view bind vidual DOM event listeners to controller (I think)

//use local cache for all static data

//have MVC solve different views problem, a view can be a combination of html,css, and javascript, but not controllers or model.

//rebuild MVC so libraries are also MVC

//global for root file://local or http://nikondi




