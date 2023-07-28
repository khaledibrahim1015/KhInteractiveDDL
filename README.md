# KhInteractiveDDL
"KhInteractiveDDL" is an interactive &amp; dynamic multi-select drop-down control. It includes "Select All," collapsible nested options, search, and customization. Simplify data selection tasks effortlessly. Open-source.
DropDownControl Documentation

Introduction:

DropDownControl is a JavaScript controller that facilitates the creation and management of customizable drop-down menus. It allows the user to create drop-down lists with various features, including single or multi-selection, search functionality, collapse and expand options, and more. This documentation will provide an in-depth understanding of the functionalities and usage of the DropDownControl controller.

Usage:

To use the DropDownControl, you need to include the JavaScript code for the controller in your project and initialize it by calling the createDDL() function with appropriate configuration parameters. The controller generates the required HTML and event handlers to create and manage the drop-down lists based on the provided configuration.

Functionality Overview:

The DropDownControl provides the following functionalities:

    Mapper Function (mapper):
        This function validates and modifies the properties of the configuration object passed to it.
        It ensures that the properties are of the correct type and assigns default values for missing or invalid properties.
        The returned object, actualObj, will contain the validated properties.

    Create Drop-Down List (createDDL):
        This function creates the drop-down list based on the configuration object provided.
        It calls the mapper function to validate the configuration and extract the required properties.
        The drop-down list is created as a child of a specified HTML container element (specified by dropDownContainerId).
        Various optional features like search, multi-selection, and collapse/expand can be enabled or disabled through the configuration object.

    Manipulate DOM (manipulateDom):
        This function is responsible for managing the visibility and interactions with the drop-down list.
        It listens for click events outside the drop-down list to close any open drop-downs when clicked elsewhere on the page.

    Single Selection (singleSelection):
        Handles the behavior of single-select drop-down lists.
        Updates the selected option when a user clicks on an option, and calls the onchange function if provided.

    Multi-Selection (MultiSelection):
        Handles the behavior of multi-select drop-down lists.
        Allows users to select multiple options and updates the selected options accordingly.
        Calls the onchange function if provided.

    Create Searchable Drop-Down List (createSearchableDDL):
        If enabled through the configuration, it adds a search input to the drop-down list.
        Allows users to filter options based on their input.

    Create Select All and Deselect All Buttons (createSelectAllAndDeSelectAll):
        If enabled through the configuration, it adds "Select All" and "Deselect All" buttons to the drop-down list for multi-select lists.
        Allows users to quickly select or deselect all available options.

    Rendering Options for Simple Data (drawingSimpleData):
        Handles the rendering of simple data options in the drop-down list.
        Validates the format of the data and renders options accordingly.

    Rendering Options for Complex Data (drawingComplexData):
        Handles the rendering of complex data options in the drop-down list.
        Validates the format of the data and renders parent options with child options.

    Collapse and Expand Feature (CollapseAndExpand):
        If enabled through the configuration, it allows users to collapse or expand nested child options.

    Get Selected Value (getSelectedVal):
        Retrieves the selected value(s) from the drop-down list.
        Returns an array of selected option objects, including label and value.

    Set Selected Option By Data (setSelectedOptionByData):
        Sets the selected option based on the provided data object.
        Used to pre-select options when initializing the drop-down list with specific data.

Configuration Options:

The configuration object passed to the createDDL() function can have the following properties:

    dropDownSelectedOptionInnerText (string): The text displayed in the drop-down when no option is selected.
    dropDownContainerId (string): The HTML element ID where the drop-down will be appended.
    isSearchable (boolean): Enable/disable the search functionality.
    isSelectAllAndDeSelectAll (object): Enable/disable the "Select All" and "Deselect All" buttons.
    isCollapseAndExpand (boolean): Enable/disable the collapse and expand functionality for nested child options.
    isMultiSelection (boolean): Enable/disable multi-selection in the drop-down list.
    isSimpleData (boolean): Specify whether the data is simple (label-value pairs) or complex (parent-child options).
    isChecked (boolean): If true, uses checkboxes for complex data options, else uses divs.
    data (array): An array of options to be rendered in the drop-down. Required for rendering options.

Event Handling:

DropDownControl provides an onchange event that can be set in the configuration object. When an option is selected or deselected, this event will be triggered, and the provided callback function will be executed. The callback function can then retrieve the selected values using the getSelectedVal() function.

Example Usage:

javascript

// Configuration object
var config = {
    dropDownSelectedOptionInnerText: "Choose an option",
    dropDownContainerId: "myDropDown",
    isSearchable: true,
    isSelectAllAndDeSelectAll: {
        isExist: true,
        selectallVal: "Select All",
        deSelectAllVal: "Deselect All",
    },
    isCollapseAndExpand: true,
    isMultiSelection: true,
    isSimpleData: false,
    isChecked: true,
    data: [
        { label: "Option 1", value: "opt1" },
        { label: "Option 2", value: "opt2" },
        { label: "Option 3", value: "opt3" },
    ],
    onchange: function (selectedValues) {
        console.log("Selected values:", selectedValues);
    },
};

// Create the drop-down list
DropDownControl.createDDL(config);

Conclusion:

DropDownControl is a versatile JavaScript controller that simplifies the creation and management of drop-down lists. 
It offers a range of features, such as single and multi-selection, search functionality, and nested options,
 and can be customized according to specific project requirements. By following this documentation and understanding the functionalities, 
users can effortlessly integrate and utilize DropDownControl to enhance their web applications with interactive drop-down lists.



Example 1: Simple Single Selection Drop-Down

In this example, we will create a simple drop-down list with single selection functionality.

html

<!DOCTYPE html>
<html>
<head>
    <title>Simple Single Selection Drop-Down</title>
</head>
<body>
    <div id="dropDownContainer"></div>
    <script src="dropdown-control.js"></script>
    <script>
        var config = {
            dropDownSelectedOptionInnerText: "Select an option",
            dropDownContainerId: "dropDownContainer",
            data: [
                { label: "Option 1", value: "opt1" },
                { label: "Option 2", value: "opt2" },
                { label: "Option 3", value: "opt3" },
            ],
            onchange: function (selectedValues) {
                console.log("Selected values:", selectedValues);
            },
        };

        DropDownControl.createDDL(config);
    </script>
</body>
</html>

Example 2: Multi-Selection Drop-Down with Select All and Deselect All Buttons

In this example, we will create a multi-selection drop-down with "Select All" and "Deselect All" buttons.

html

<!DOCTYPE html>
<html>
<head>
    <title>Multi-Selection Drop-Down with Select All</title>
</head>
<body>
    <div id="dropDownContainer"></div>
    <script src="dropdown-control.js"></script>
    <script>
        var config = {
            dropDownSelectedOptionInnerText: "Select options",
            dropDownContainerId: "dropDownContainer",
            isSelectAllAndDeSelectAll: {
                isExist: true,
                selectallVal: "Select All",
                deSelectAllVal: "Deselect All",
            },
            isMultiSelection: true,
            data: [
                { label: "Option 1", value: "opt1" },
                { label: "Option 2", value: "opt2" },
                { label: "Option 3", value: "opt3" },
                { label: "Option 4", value: "opt4" },
            ],
            onchange: function (selectedValues) {
                console.log("Selected values:", selectedValues);
            },
        };

        DropDownControl.createDDL(config);
    </script>
</body>
</html>

Example 3: Complex Data Drop-Down with Collapse and Expand

In this example, we will create a drop-down list with complex data containing parent and child options. The drop-down will have collapse and expand functionality for nested options.

html

<!DOCTYPE html>
<html>
<head>
    <title>Complex Data Drop-Down with Collapse and Expand</title>
</head>
<body>
    <div id="dropDownContainer"></div>
    <script src="dropdown-control.js"></script>
    <script>
        var config = {
            dropDownSelectedOptionInnerText: "Select an option",
            dropDownContainerId: "dropDownContainer",
            isCollapseAndExpand: true,
            isMultiSelection: true,
            isSimpleData: false,
            isChecked: true,
            data: [
                {
                    label: "Group A",
                    value: "groupA",
                    children: [
                        { label: "Option 1", value: "opt1" },
                        { label: "Option 2", value: "opt2" },
                    ],
                },
                {
                    label: "Group B",
                    value: "groupB",
                    children: [
                        { label: "Option 3", value: "opt3" },
                        { label: "Option 4", value: "opt4" },
                    ],
                },
            ],
            onchange: function (selectedValues) {
                console.log("Selected values:", selectedValues);
            },
        };

        DropDownControl.createDDL(config);
    </script>
</body>
</html>

These examples demonstrate different scenarios where DropDownControl can be used to create interactive drop-down lists with various functionalities. Feel free to experiment and modify the configuration based on your project requirements.
