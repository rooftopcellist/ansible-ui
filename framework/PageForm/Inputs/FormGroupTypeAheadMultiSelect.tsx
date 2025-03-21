import {
  Chip,
  ChipGroup,
  FormGroupProps,
  Select,
  SelectOption,
  SelectOptionObject,
  SelectProps,
  SelectVariant,
} from '@patternfly/react-core';
import React, { useState } from 'react';
import { PageFormGroup } from './PageFormGroup';

export type FormGroupTypeAheadMultiSelectProps = Pick<
  FormGroupProps,
  'helperTextInvalid' | 'children'
> &
  Pick<
    SelectProps,
    | 'footer'
    | 'isCreatable'
    | 'isGrouped'
    | 'placeholderText'
    | 'value'
    | 'isDisabled'
    | 'children'
    | 'onSelect'
  > & {
    isReadOnly?: boolean;
    placeholderText?: string | React.ReactNode;
    name: string;
    options: { value: string | { name: string }; label: string }[];
    id?: string;
    onSelect?: (
      event: React.MouseEvent | React.ChangeEvent,
      value: string | SelectOptionObject,
      isPlaceholder?: boolean
    ) => void;
    onHandleSelection: (value: string | SelectOptionObject | { name: string }) => void;
    isSubmitting: boolean;
    value: Partial<{ name: string }>[];
    onHandleClear: (chip?: string) => void;
  };

/** A PatternFly FormGroup with a PatternFly Select */
export function FormGroupTypeAheadMultiSelect(props: FormGroupTypeAheadMultiSelectProps) {
  const {
    onHandleSelection,
    onHandleClear,
    value,
    id,
    name,
    options,
    placeholderText,
    isSubmitting,
    isReadOnly,
    ...rest
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  const chipGroupComponent = () => {
    if (!value) {
      return;
    }
    return (
      <ChipGroup>
        {value.map((v) => (
          <Chip
            key={v.name}
            onClick={() => {
              onHandleClear(v.name);
            }}
          >
            {v.name}
          </Chip>
        ))}
      </ChipGroup>
    );
  };
  return (
    <PageFormGroup {...rest}>
      <Select
        chipGroupComponent={chipGroupComponent()}
        variant={SelectVariant.typeaheadMulti}
        isCreatable
        placeholderText={!value?.length && placeholderText}
        isOpen={isOpen}
        isCreateOptionOnTop
        onClear={() => onHandleClear()}
        id={id ?? name}
        selections={value}
        onToggle={() => {
          setIsOpen(!isOpen);
        }}
        onSelect={(_, v) => {
          if (typeof v === 'string') {
            return onHandleSelection({ name: v });
          }
          onHandleSelection(v);
        }}
        isDisabled={isReadOnly || isSubmitting}
      >
        {options.map((option) => (
          <SelectOption key={option.label} value={option.value}>
            {option.label}
          </SelectOption>
        ))}
      </Select>
    </PageFormGroup>
  );
}
