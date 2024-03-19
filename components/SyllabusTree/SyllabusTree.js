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
  let dNV = 'subjectId';
  let cNN = 'syllabus';

  const selectAccountFunc = (newSelectedOptions, option) => {
    if (option[cNN] && option[cNN].length) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setSelectedOptions({...newSelectedOptions});
    } else {
      props.onPress && props.onPress(option);
    }
  };

  let checkType = data ? (data instanceof Array ? data : []) : [];

  return (
    <ScrollView contentContainerStyle={tw`px-2 py-1`}>
      <OptionsList
        options={checkType}
        selectedOptions={selectedOptions}
        iconColor={rest?.iconColor}
        onChange={selectAccountFunc}
        onLongPress={rest?.onLongPress}
        displayNodeName={dNN}
        displayNodeValue={dNV}
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
  iconColor,
  onChange,
  onLongPress,
  ...rest
}) => {
  const {displayNodeName, displayNodeValue, childrenNodeName} = rest;

  const handleParentClicked = option => {
    if (selectedOptions[option[displayNodeValue]]) {
      delete selectedOptions[option[displayNodeValue]];
    } else {
      selectedOptions[option[displayNodeValue]] = {};
    }
    onChange(selectedOptions, option);
  };

  const handleSubOptionsListChange = (subSelections, option) => {
    selectedOptions[option[displayNodeValue]] = subSelections;
    onChange(selectedOptions, option);
  };

  return (
    <View>
      {options.map(option => (
        <View key={option[displayNodeValue]} style={tw.style({flex: 1})}>
          <List
            label={option[displayNodeName]}
            value={option[displayNodeValue]}
            items={option[childrenNodeName]}
            selected={selectedOptions[option[displayNodeValue]]}
            iconColor={iconColor}
            onChange={() => {
              handleParentClicked(option);
            }}
            onLongPress={() => {
              onLongPress(option);
            }}
            {...rest}
          />

          {/* Recursive Case */}
          {option[childrenNodeName] &&
            option[childrenNodeName].length > 0 &&
            selectedOptions[option[displayNodeValue]] && (
              <View style={tw`ml-4`}>
                <OptionsList
                  options={option[childrenNodeName]}
                  selectedOptions={selectedOptions[option[displayNodeValue]]}
                  iconColor={iconColor}
                  onChange={(subSelections, opt) => {
                    handleSubOptionsListChange(subSelections, opt);
                  }}
                  onLongPress={() => {
                    onLongPress(option[childrenNodeName]);
                  }}
                  {...rest}
                />
              </View>
            )}
        </View>
      ))}
    </View>
  );
};

// Dumb List component, completely controlled by parent
const List = memo(
  ({label, iconColor, value, items, selected, onChange, onLongPress}) => {
    console.log({label, value, items, selected});
    return (
      <View style={tw`flex-1`}>
        <TreeItem
          text={label}
          iconColor={iconColor}
          rightImage={!!items?.length}
          onPress={() => onChange(!selected, label, value, items)}
          onLongPress={() => onLongPress(!selected, label, value, items)}
        />
      </View>
    );
  },
);

SyllabusTree.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
};
