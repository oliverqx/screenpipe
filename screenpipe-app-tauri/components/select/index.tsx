import type { GroupBase, Props, SingleValue, MultiValue } from "react-select"
import CreatableSelect from 'react-select/creatable';
import SelectReact, { StylesConfig } from 'react-select';
import * as React from "react"

export type SelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> = Props<Option, IsMulti, Group> & { isCreateable?: boolean, isSpecial?: boolean };


const Select = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  components,
  isCreateable,
  isSpecial,
  ...props
}: SelectProps<Option, IsMulti, Group>) => {
  const { menuPlacement = "auto", ...restProps } = props;

  const Comp = isCreateable ? CreatableSelect : SelectReact
  const styles: StylesConfig<Option, IsMulti, Group> | undefined  = isSpecial ? {
    'control': (css) => {
      return {
        ...css,
        backgroundColor: 'hsl(0, 0%, 100%)',
        borderStyle: 'hidden',
      }
    }
  } : undefined

  return (
    <Comp
      isSearchable
      {...restProps}
      styles={styles}
    />
  );
};

export default Select 