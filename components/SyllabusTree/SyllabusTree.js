import {tw} from '@lib';
import PropTypes from 'prop-types';
import {TreeItem} from './TreeItem';
import React, {memo, useState} from 'react';
import {View, UIManager, ScrollView, LayoutAnimation} from 'react-native';

export const SyllabusTree = props => {
  const [selectedOptions, setSelectedOptions] = useState({});

  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);

  const {data, ...rest} = props;

  let dNN = 'name';
  let dNV = 'value';
  let dNS = 'isSection';
  let dNI = 'subjectId';
  let cNN = 'syllabus';

  const selectAccountFunc = (newSelectedOptions, option) => {
    if (option[cNN] && option[cNN].length) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setSelectedOptions({...newSelectedOptions});
    } else {
      !option[dNS] && props.onPress && props.onPress(option);
    }
  };

  let checkType = data ? (data instanceof Array ? data : []) : [];

  return (
    <ScrollView contentContainerStyle={tw`px-2 py-4`}>
      <OptionsList
        options={checkType}
        selectedOptions={selectedOptions}
        onChange={selectAccountFunc}
        onPressAdd={rest?.onPressAdd}
        onPressEdit={rest?.onPressEdit}
        onPressDelete={rest?.onPressDelete}
        isAdmin={rest?.isAdmin}
        iconColor={rest?.iconColor}
        displayNodeId={dNI}
        displayNodeName={dNN}
        displayNodeValue={dNV}
        displayNodeSection={dNS}
        childrenNodeName={cNN}
        {...rest}
      />
    </ScrollView>
  );
};

// Recursive component
const OptionsList = ({
  options,
  selectedOptions,
  onChange,
  onPressAdd,
  onPressEdit,
  onPressDelete,
  isAdmin,
  iconColor,
  ...rest
}) => {
  const {
    displayNodeName,
    displayNodeId,
    displayNodeValue,
    displayNodeSection,
    childrenNodeName,
  } = rest;

  const handleParentClicked = option => {
    if (selectedOptions[option[displayNodeId]]) {
      delete selectedOptions[option[displayNodeId]];
    } else {
      selectedOptions[option[displayNodeId]] = {};
    }
    onChange(selectedOptions, option);
  };

  const handleSubOptionsListChange = (subSelections, option) => {
    selectedOptions[option[displayNodeId]] = subSelections;
    onChange(selectedOptions, option);
  };

  const handleAddClicked = option => {
    onPressAdd(option);
  };

  const handleEditClicked = option => {
    onPressEdit(option);
  };

  const handleDeleteClicked = option => {
    onPressDelete(option);
  };

  return (
    <View>
      {options.map(option =>
        !isAdmin &&
        option[displayNodeSection] &&
        !option[childrenNodeName].length ? null : (
          <View key={option[displayNodeId]} style={tw.style({flex: 1})}>
            <List
              label={option[displayNodeName]}
              onChange={() => {
                handleParentClicked(option);
              }}
              onPressAdd={() => {
                const subjectIds = Array.from(option[displayNodeValue]);
                handleAddClicked({subjectIds});
              }}
              onPressEdit={() => {
                const subjectIds = Array.from(option[displayNodeValue]);
                const subjectId = subjectIds.pop();
                handleEditClicked({
                  subjectId,
                  subjectIds,
                  subjectName: option[displayNodeName],
                  isSection: option[displayNodeSection],
                });
              }}
              onPressDelete={() => {
                const subjectIds = Array.from(option[displayNodeValue]);
                const subjectId = subjectIds.pop();
                handleDeleteClicked({
                  subjectId,
                  subjectIds,
                });
              }}
              isAdmin={isAdmin}
              isSection={option[displayNodeSection]}
              subjectCount={option[childrenNodeName]?.length}
              iconColor={iconColor}
            />
            {/* Recursive Case */}
            {option[childrenNodeName] &&
              option[childrenNodeName].length > 0 &&
              selectedOptions[option[displayNodeId]] && (
                <View style={tw`ml-4`}>
                  <OptionsList
                    options={option[childrenNodeName]}
                    selectedOptions={selectedOptions[option[displayNodeId]]}
                    onChange={(subSelections, opt) => {
                      handleSubOptionsListChange(subSelections, opt);
                    }}
                    onPressAdd={onPressAdd}
                    onPressEdit={onPressEdit}
                    onPressDelete={onPressDelete}
                    isAdmin={isAdmin}
                    iconColor={iconColor}
                    {...rest}
                  />
                </View>
              )}
          </View>
        ),
      )}
    </View>
  );
};

// Dumb List component, completely controlled by parent
const List = memo(
  ({
    label,
    onChange,
    onPressAdd,
    onPressEdit,
    onPressDelete,
    isAdmin,
    isSection,
    subjectCount,
    iconColor,
  }) => {
    return (
      <View style={tw`flex-1`}>
        <TreeItem
          label={label}
          onPress={onChange}
          onPressAdd={onPressAdd}
          onPressEdit={onPressEdit}
          onPressDelete={onPressDelete}
          isAdmin={isAdmin}
          isSection={isSection}
          subjectCount={subjectCount}
          iconColor={iconColor}
        />
      </View>
    );
  },
);

SyllabusTree.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
};
