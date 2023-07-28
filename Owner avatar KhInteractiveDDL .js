var DropDownControl = {
    mapper: function (obj) {
        var actualObj = {};

        if (!obj || typeof obj !== 'object') {
            return actualObj;
        }

        actualObj.dropDownSelectedOptionInnerText = obj.dropDownSelectedOptionInnerText && typeof obj.dropDownSelectedOptionInnerText === 'string' ? obj.dropDownSelectedOptionInnerText : 'undefined';
        actualObj.dropDownContainerId = obj.dropDownContainerId && typeof obj.dropDownContainerId === 'string' ? obj.dropDownContainerId : 'undefined';
        actualObj.isSearchable = obj.isSearchable && typeof obj.isSearchable === 'boolean' ? obj.isSearchable : false;
        actualObj.isSelectAllAndDeSelectAll = {
            isExist: obj.isSelectAllAndDeSelectAll && typeof obj.isSelectAllAndDeSelectAll.isExist === 'boolean' ? obj.isSelectAllAndDeSelectAll.isExist : false
        };
        actualObj.isCollapseAndExpand = obj.isCollapseAndExpand && typeof obj.isCollapseAndExpand === 'boolean' ? obj.isCollapseAndExpand : false;
        actualObj.isMultiSelection = obj.isMultiSelection && typeof obj.isMultiSelection === 'boolean' ? obj.isMultiSelection : false;
        actualObj.isSimpleData = obj.isSimpleData && typeof obj.isSimpleData === 'boolean' ? obj.isSimpleData : false;
        actualObj.isChecked = obj.isChecked && typeof obj.isChecked === 'boolean' ? obj.isChecked : false;
        actualObj.onchange = obj.onchange && typeof obj.onchange === 'function' ? obj.onchange : false;

        return actualObj;
    },

    createDDL: function (obj) {

        var actualObj = this.mapper(obj);

        var dropDownContainer = document.getElementById(actualObj.dropDownContainerId);
        if (!dropDownContainer) {
            return;
        }

        var dropDownWrapper = document.createElement('div');
        dropDownWrapper.className = 'dropDownWrapper' + actualObj.dropDownContainerId;
        dropDownWrapper.id = 'dropDownWrapper' + actualObj.dropDownContainerId;
        dropDownWrapper.style.border = '1px solid #ee8d8d';
        dropDownWrapper.style.borderRadius = '5px';
        dropDownWrapper.style.padding = '10px';
        dropDownWrapper.style.width = '250px';
        dropDownWrapper.style.direction = 'rtl';


        var dropDownSelectedOption = document.createElement('div');
        dropDownSelectedOption.id = 'dropDownSelectedOption' + actualObj.dropDownContainerId;
        dropDownSelectedOption.className = 'dropDownSelectedOption' + actualObj.dropDownContainerId;
        dropDownSelectedOption.innerText = actualObj.dropDownSelectedOptionInnerText || 'Choose';
        dropDownWrapper.appendChild(dropDownSelectedOption);

        var dropDownOptions = document.createElement('div');
        dropDownOptions.className = 'dropDownOptions' + actualObj.dropDownContainerId;
        dropDownOptions.id = 'dropDownOptions' + actualObj.dropDownContainerId;
        dropDownOptions.style.display = 'none';

        dropDownWrapper.appendChild(dropDownOptions);

        dropDownContainer.appendChild(dropDownWrapper);

        if (actualObj.isSearchable) {
            this.createSearchableDDL(actualObj);
        }

        if (actualObj.isSelectAllAndDeSelectAll) {
            if (actualObj.isMultiSelection) {
                this.createSelectAllAndDeSelectAll(obj);
            }
        }

        if (actualObj.isSimpleData) {
            this.drawingSimpleData(obj);
        }

        if (!actualObj.isSimpleData) {
            this.drawingcomplexData(obj);
        }

        if (actualObj.isCollapseAndExpand) {
            this.CollapseAndExpand(obj);
        }

        if (!actualObj.isMultiSelection) {
            this.singleSelection(obj)
        }

        if (actualObj.isMultiSelection) {
            this.MultiSelection(actualObj)
        }
        DropDownControl.manipulateDom(actualObj);
    },
    manipulateDom: function (obj) {
        var currentOpenDropdownOptions = null;
        document.addEventListener('click', (event) => {
            var dropDownWrappers = document.querySelectorAll('.dropDownWrapper' + obj.dropDownContainerId);
            for (var i = 0; i < dropDownWrappers.length; i++) {
                var dropDownWrapper = dropDownWrappers[i];
                var dropDownOptions = dropDownWrapper.querySelector('.dropDownOptions' + obj.dropDownContainerId);

                if (dropDownWrapper.contains(event.target)) {
                    if (currentOpenDropdownOptions !== dropDownOptions) {
                        if (currentOpenDropdownOptions) {
                            currentOpenDropdownOptions.style.display = 'none';
                        }
                        dropDownOptions.style.display = 'block';
                        currentOpenDropdownOptions = dropDownOptions;
                    }
                    return;
                }
            }
            if (currentOpenDropdownOptions) {
                currentOpenDropdownOptions.style.display = 'none';
                currentOpenDropdownOptions = null;
            }
        });
    },

    singleSelection: function (obj) {
        var optionsList = document.querySelectorAll('.dropDownOption' + obj.dropDownContainerId);
        var selectedOption = null;

        optionsList.forEach((option) => {
            if (obj.isSimpleData) {
                option.addEventListener('click', () => {
                    if (selectedOption === option) {
                        selectedOption = null;
                    } else {
                        selectedOption = option;
                    }
                    var dropDownSelectedOption = document.getElementById('dropDownSelectedOption' + obj.dropDownContainerId);
                    if (selectedOption) {
                        dropDownSelectedOption.innerText = selectedOption.textContent;
                    } else {
                        dropDownSelectedOption.innerText = obj.dropDownSelectedOptionInnerText || 'Choose';
                    }
                    var dropDownOptions = document.getElementById('dropDownOptions' + obj.dropDownContainerId);
                    dropDownOptions.style.display = 'none';
                    optionsList.forEach((opt) => {
                        opt.style.backgroundColor = opt === selectedOption ? 'yellow' : 'white';
                    });

                    if (selectedOption) {
                        var selectedData = {
                            label: selectedOption.textContent,
                            value: selectedOption.value
                        };
                        DropDownControl.setSelectedOptionByData(obj, selectedData);
                    }
                    if (obj.onchange) {

                        obj.onchange(this.getSelectedVal(obj.dropDownContainerId))
                    }
                });

            } else {
                var checkbox = option.querySelector('input[type="checkbox"]');

                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        if (selectedOption) {
                            selectedOption.querySelector('input[type="checkbox"]').checked = false;
                        }
                        selectedOption = option;
                    } else {
                        selectedOption = null;
                    }
                    var dropDownSelectedOption = document.getElementById('dropDownSelectedOption' + obj.dropDownContainerId);
                    if (selectedOption) {
                        dropDownSelectedOption.innerText = selectedOption.textContent;
                    } else {
                        dropDownSelectedOption.innerText = obj.dropDownSelectedOptionInnerText || 'Choose';
                    }
                    var dropDownOptions = document.getElementById('dropDownOptions' + obj.dropDownContainerId);
                    dropDownOptions.style.display = 'none';
                    optionsList.forEach((opt) => {
                        var optCheckbox = opt.querySelector('input[type="checkbox"]');
                        optCheckbox.style.backgroundColor = opt === selectedOption ? 'red' : 'white';
                    });
                });
            }
        });
    },


    MultiSelection: function (obj) {
        var optionsList = document.querySelectorAll('.dropDownOption' + obj.dropDownContainerId);

        optionsList.forEach((option) => {
            var checkBox = document.createElement('input');
            checkBox.type = 'checkbox';
            checkBox.value = option.value;
            option.insertBefore(checkBox, option.firstChild);
        });

        optionsList.forEach((option) => {
            option.addEventListener('click', () => {

                var el = option.querySelector('input[type="checkbox"]');
                el.checked = !el.checked;
                option.style.backgroundColor = option.style.backgroundColor == 'yellow' ? 'white' : 'yellow';

                var dropDownSelectedOption = document.getElementById('dropDownSelectedOption' + obj.dropDownContainerId);
                var selectedOptions = [];
                optionsList.forEach((option) => {
                    var checkBox = option.querySelector('input[type="checkbox"]');
                    if (checkBox.checked) {
                        var lbl = option.textContent;
                        var val = option.querySelector('input[type="checkbox"]').value;
                        var obj = { label: lbl, value: val }

                        selectedOptions.push(obj);
                    }
                });
                if (selectedOptions.length > 0) {
                    var selectedText = selectedOptions.map((item) => `${item.value}`).join(', ');

                    dropDownSelectedOption.innerText = selectedText;
                } else {
                    dropDownSelectedOption.innerText = obj.dropDownSelectedOptionInnerText || 'Choose';
                }
            });

        });
        optionsList.forEach((option) => {
            option.addEventListener('change', () => {

                var el = option.querySelector('input[type="checkbox"]');
                el.checked = !el.checked;
                if (el.checked) {
                    option.style.backgroundColor = 'yellow'
                } else {
                    option.style.backgroundColor = 'white'

                }
                var dropDownSelectedOption = document.getElementById('dropDownSelectedOption' + obj.dropDownContainerId);
                var selectedOptions = [];
                optionsList.forEach((option) => {
                    var checkBox = option.querySelector('input[type="checkbox"]');
                    if (checkBox.checked) {
                        selectedOptions.push(option.textContent);
                    }
                });
                if (selectedOptions.length > 0) {
                    dropDownSelectedOption.innerText = selectedOptions.join(', ');
                } else {
                    dropDownSelectedOption.innerText = obj.dropDownSelectedOptionInnerText || 'Choose';
                }

                // fire userDefined OnChange 
                if (obj.onchange) {

                    obj.onchange(this.getSelectedVal(obj.dropDownContainerId))
                }


            });

        });

    },
    createSearchableDDL: function (obj) {
        var dropDownOptions = document.getElementById('dropDownOptions' + obj.dropDownContainerId);
        var searchableInput = document.createElement('input');
        searchableInput.type = 'text';
        searchableInput.id = 'dropdown-search';
        searchableInput.className = 'dropdown-search';
        searchableInput.placeholder = 'Search....';

        dropDownOptions.appendChild(searchableInput);
        searchableInput.addEventListener('input', () => {
            var searchText = searchableInput.value.toLowerCase();

            if (!obj.isSimpleData) {
                var parents = document.getElementsByClassName('dropDownOptionParent' + obj.dropDownContainerId);
                for (let index = 0; index < parents.length; index++) {
                    var currentIteratedParent = parents[index];
                    if (currentIteratedParent.hasChildNodes()) {
                        var optionListForCurrentIteratedParent = currentIteratedParent.querySelectorAll('.dropDownOption' + obj.dropDownContainerId);
                        var optionsLengthForCurrentIteratedParent = optionListForCurrentIteratedParent.length;

                        for (let i = 0; i < optionListForCurrentIteratedParent.length; i++) {
                            var currentOption = optionListForCurrentIteratedParent[i];
                            var label = currentOption.innerText.toLowerCase();
                            if (searchText === '' || label.includes(searchText)) {
                                currentOption.style.display = 'block';
                            } else {
                                currentOption.style.display = 'none';
                                optionsLengthForCurrentIteratedParent--;
                            }
                        }

                        if (optionsLengthForCurrentIteratedParent === 0) {
                            currentIteratedParent.style.display = 'none';
                        } else {
                            currentIteratedParent.style.display = 'block';
                        }
                    }
                }
            } else {
                var optionsList = document.querySelectorAll('.dropDownOption' + obj.dropDownContainerId);
                for (let i = 0; i < optionsList.length; i++) {
                    var option = optionsList[i];
                    var label = option.innerText.toLowerCase();
                    if (searchText === '' || label.includes(searchText)) {
                        option.style.display = 'block';
                    } else {
                        option.style.display = 'none';
                    }
                }
            }
        });
    },
    createSelectAllAndDeSelectAll: function (obj) {
        var dropDownOptions = document.getElementById('dropDownOptions' + obj.dropDownContainerId);
        var selectAllInput = document.createElement('input');
        selectAllInput.type = 'button';
        selectAllInput.id = 'selectAllInput' + obj.dropDownContainerId;
        selectAllInput.className = 'selectAllInput' + obj.dropDownContainerId;
        selectAllInput.value = obj.isSelectAllAndDeSelectAll.selectallVal || 'Select All';

        var br = document.createElement('br');

        var deSelectAllInput = document.createElement('input');
        deSelectAllInput.type = 'button';
        deSelectAllInput.id = 'deSelectAllInput' + obj.dropDownContainerId;
        deSelectAllInput.className = 'deSelectAllInput' + obj.dropDownContainerId;
        deSelectAllInput.value = obj.isSelectAllAndDeSelectAll.deSelectAllVal || 'Deselect All';

        dropDownOptions.appendChild(br);
        dropDownOptions.appendChild(selectAllInput);
        dropDownOptions.appendChild(deSelectAllInput);

        selectAllInput.addEventListener('click', () => {
            var visibleOptions = DropDownControl.getVisibleOptions(obj);
            visibleOptions.forEach((option) => {
                option.querySelector('input[type="checkbox"]').checked = true;
                option.style.backgroundColor = 'yellow';
            });

            var dropDownSelectedOption = document.getElementById('dropDownSelectedOption' + obj.dropDownContainerId);
            var selectedOptions = [];
            visibleOptions.forEach((option) => {
                selectedOptions.push(option.textContent);
            });
            dropDownSelectedOption.innerText = selectedOptions.join(', ');
        });

        deSelectAllInput.addEventListener('click', () => {
            var visibleOptions = DropDownControl.getVisibleOptions(obj);
            visibleOptions.forEach((option) => {
                option.querySelector('input[type="checkbox"]').checked = false;
                option.style.backgroundColor = 'white';
            });

            var dropDownSelectedOption = document.getElementById('dropDownSelectedOption' + obj.dropDownContainerId);
            dropDownSelectedOption.innerText = obj.dropDownSelectedOptionInnerText || 'Choose';
        });
    },

    getVisibleOptions: function (obj) {
        var optionsList = document.querySelectorAll('.dropDownOption' + obj.dropDownContainerId);
        return Array.from(optionsList).filter((option) => option.style.display !== 'none');
    },

    drawingSimpleData: function (obj) {
        if (obj.hasOwnProperty('data') && Array.isArray(obj.data)) {
            if (DropDownControl.checkPropertyOfData(obj.data)) {
                DropDownControl.renderOptionsForSimpleData(obj, obj.data);
            }
        }
    },

    checkPropertyOfData: function (data) {
        for (var i = 0; i < data.length; i++) {
            var currentObject = data[i];
            if (!currentObject.label || typeof currentObject.label !== 'string' ||
                !currentObject.value || typeof currentObject.value !== 'string') {
                return false;
            }
            if (currentObject.hasOwnProperty('children')) {
                return false;
            }
        }
        return true;
    },

    renderOptionsForSimpleData: function (obj, data) {
        var dropDownOptionsList = document.getElementById('dropDownOptions' + obj.dropDownContainerId);
        if (!dropDownOptionsList) {
            return;
        }
        var data = obj.data;
        data.forEach((optionData) => {
            var option = this.createOptionSimpleData(optionData, obj);
            dropDownOptionsList.appendChild(option);
        });
    },

    createOptionSimpleData: function (optionData, obj) {
        var option = document.createElement('div');
        option.id = 'dropDownOption' + obj.dropDownContainerId + '-' + optionData.value;
        option.className = 'dropDownOption' + obj.dropDownContainerId;

        option.textContent = optionData.label;
        option.value = optionData.value;

        return option;
    },

    drawingcomplexData: function (obj) {
        if (obj.hasOwnProperty('data') && Array.isArray(obj.data)) {
            if (DropDownControl.checkPropertyOfDataforDrawingComplexData(obj.data)) {
                DropDownControl.renderOptionsForComplexData(obj);
            }
        } else {
            return;
        }
    },

    checkPropertyOfDataforDrawingComplexData: function (dataProp) {
        if (Array.isArray(dataProp)) {
            for (var i = 0; i < dataProp.length; i++) {
                var currentIteratedObj = dataProp[i];
                if (
                    typeof currentIteratedObj !== "object" ||
                    !currentIteratedObj.label ||
                    typeof currentIteratedObj.label !== "string" ||
                    !currentIteratedObj.value ||
                    typeof currentIteratedObj.value !== "string" ||
                    !Array.isArray(currentIteratedObj.children) ||
                    currentIteratedObj.children.length == 0   
                ) {
                    return false;
                }

                for (var j = 0; j < currentIteratedObj.children.length; j++) {
                    var currentIteratedChild = currentIteratedObj.children[j];
                    if (
                        typeof currentIteratedChild !== "object" ||
                        !currentIteratedChild.label ||
                        typeof currentIteratedChild.label !== "string" ||
                        !currentIteratedChild.value ||
                        typeof currentIteratedChild.value !== "string"
                    ) {
                        return false;
                    }
                }
            }
            return true;
        } else {
            return false;
        }
    },

    renderOptionsForComplexData: function (obj) {
        var dropDownOptionsList = document.getElementById('dropDownOptions' + obj.dropDownContainerId);
        if (!dropDownOptionsList) {
            return;
        }
        var data = obj.data;
        data.forEach((item) => {
            var option = this.createOptionForComplexData(item, obj);
            dropDownOptionsList.appendChild(option);
        });

    },

    createOptionForComplexData: function (optionData, obj) {
        var optionParent = document.createElement('div');
        optionParent.id = 'dropDownOptionParent' + obj.dropDownContainerId + '-' + optionData.value;
        optionParent.className = 'dropDownOptionParent' + obj.dropDownContainerId;
        optionParent.textContent = optionData.label;
        optionParent.value = optionData.value;
        
        if (obj.isChecked && typeof obj.isChecked === 'boolean') {
            var optionChild = this.createChildrenOptionsCheckBoxes(optionData.children, obj);
            optionParent.appendChild(optionChild);
        }

        if (!obj.isChecked && typeof obj.isChecked === 'boolean') {
            var optChild = this.createChildrenOptionsDivs(optionData.children, obj);
            optionParent.appendChild(optChild);
        }

        return optionParent;
    },

    createChildrenOptionsCheckBoxes: function (optionChildrenData, obj) {
        var optionChild = document.createElement('div');
        optionChild.id = 'dropDownOptionChildren' + obj.dropDownContainerId;
        optionChild.className = 'dropDownOptionChildren' + obj.dropDownContainerId;

        optionChildrenData.forEach((item) => {
            var option = document.createElement('div');
            option.className = 'dropDownOption' + obj.dropDownContainerId;
            option.id = 'dropDownOption' + obj.dropDownContainerId + '-' + item.value;

            var checkBox = document.createElement('input');
            checkBox.type = 'checkbox';
            checkBox.value = item.value;

            var label = document.createElement('label');
            label.innerText = item.label;

            option.appendChild(checkBox);
            option.appendChild(label);

            optionChild.appendChild(option);

            optionChild.addEventListener('click', (event) => {
                event.stopPropagation();
            });
        });

        return optionChild;
    },

    createChildrenOptionsDivs: function (optionChildrenData, obj) {
        var optionChild = document.createElement('div');
        optionChild.id = 'dropDownOptionChildren' + obj.dropDownContainerId;
        optionChild.className = 'dropDownOptionChildren' + obj.dropDownContainerId;

        optionChildrenData.forEach((item) => {
            var option = document.createElement('div');
            option.className = 'dropDownOption' + obj.dropDownContainerId;
            option.id = 'dropDownOption' + obj.dropDownContainerId + '-' + item.value;

            option.textContent = item.label;
            option.value = item.value;

            optionChild.appendChild(option);
        });

        optionChild.addEventListener('click', (event) => {
            event.stopPropagation();

        });

        return optionChild;
    },

    CollapseAndExpand: function (obj) {
        var dropDownOptionsClick = document.getElementById('dropDownOptions' + obj.dropDownContainerId);
        var dropDownSelectedOptionClick = document.getElementById('dropDownSelectedOption' + obj.dropDownContainerId);
        dropDownSelectedOptionClick.addEventListener('click', (event) => {
            event.stopPropagation();
            dropDownOptionsClick.style.display = dropDownOptionsClick.style.display === 'none' ? 'block' : 'none';
        });

        var dropDownOptionsParentsClick = document.getElementsByClassName('dropDownOptionParent' + obj.dropDownContainerId);
        Array.from(dropDownOptionsParentsClick).forEach((dropDownOptionParentClick) => {
            var dropDownOptionChildrenClick = dropDownOptionParentClick.querySelector('.dropDownOptionChildren' + obj.dropDownContainerId);
            dropDownOptionParentClick.addEventListener('click', (event) => {
                event.stopPropagation();
                dropDownOptionChildrenClick.style.display = dropDownOptionChildrenClick.style.display === 'none' ? 'block' : 'none';
            });
        });
    },

    getSelectedVal: function (dropDownContainerId) {
        var selectedVal = document.getElementById('dropDownSelectedOption' + dropDownContainerId);
        var arrayOfSelectedVal = selectedVal.innerText.split(',');
        var selectedOptions = [];

        if (arrayOfSelectedVal.length === 1 && arrayOfSelectedVal[0].trim().toLowerCase() === 'choose') {
            return selectedOptions;
        } else {
            var optionsList = document.querySelectorAll('.dropDownOption' + dropDownContainerId);

            optionsList.forEach((option) => {
                var checkBox = option.querySelector('input[type="checkbox"]');
                if (checkBox && checkBox.checked) {
                    var lbl = option.textContent;
                    var val = checkBox.value;
                    var obj = { label: lbl, value: val };
                    selectedOptions.push(obj);
                } else {

                    var val = option.value;
                    var lbl = option.textContent;
                    var obj = { label: lbl, value: val };
                    var selectedOption = document.getElementById('dropDownSelectedOption' + dropDownContainerId);
                    var content = selectedOption.textContent;
                    if (obj.label == content) {
                        selectedOptions.push(obj)
                    }
                }
            });

            return selectedOptions;
        }
    },

    setSelectedOptionByData: function (obj, selectedData) {
        var dropDownOptionsList = document.getElementById('dropDownOptions' + obj.dropDownContainerId);
        var optionsList = dropDownOptionsList.querySelectorAll('.dropDownOption' + obj.dropDownContainerId);

        optionsList.forEach((option) => {
            var optionLabel = option.textContent.trim();
            var optionValue = option.childNodes[0].value;

            if (optionLabel === selectedData.label && optionValue === selectedData.value) {
                if (obj.isSimpleData) {
                    var dropDownSelectedOption = document.getElementById('dropDownSelectedOption' + obj.dropDownContainerId);
                    dropDownSelectedOption.innerText = optionLabel;
                } else {
                    var checkBox = option.querySelector('input[type="checkbox"]');
                    checkBox.checked = true;
                }
            } else {
                if (!obj.isSimpleData) {
                    var checkBox = option.querySelector('input[type="checkbox"]');
                    checkBox.checked = false;
                }
            }
        });
    },

};
