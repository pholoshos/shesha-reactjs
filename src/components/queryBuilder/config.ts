/** Query Builder configuration (modified version of the standard configuration) */
export const types = {
  text: {
    defaultOperator: 'equal',
    widgets: {
      text: {
        operators: [
          'equal',
          'not_equal',
          'is_empty',
          'is_not_empty',
          'like',
          'not_like',
          'starts_with',
          'ends_with',
          //"proximity"
        ],
        widgetProps: {},
        opProps: {},
      },
      field: {
        operators: [
          //unary ops (like `is_empty`) will be excluded anyway, see getWidgetsForFieldOp()
          'equal',
          'not_equal',
          //"proximity", //can exclude if you want
        ],
      },
    },
  },
  number: {
    defaultOperator: 'equal',
    mainWidget: 'number',
    widgets: {
      number: {
        operators: [
          'equal',
          'not_equal',
          'less',
          'less_or_equal',
          'greater',
          'greater_or_equal',
          'between',
          'not_between',
          'is_empty',
          'is_not_empty',
        ],
      },
      slider: {
        operators: [
          'equal',
          'not_equal',
          'less',
          'less_or_equal',
          'greater',
          'greater_or_equal',
          'is_empty',
          'is_not_empty',
        ],
      },
    },
  },
  date: {
    defaultOperator: 'equal',
    widgets: {
      date: {
        operators: [
          'equal',
          'not_equal',
          'less',
          'less_or_equal',
          'greater',
          'greater_or_equal',
          'between',
          'not_between',
          'is_empty',
          'is_not_empty',
        ],
      },
    },
  },
  time: {
    defaultOperator: 'equal',
    widgets: {
      time: {
        operators: [
          'equal',
          'not_equal',
          'less',
          'less_or_equal',
          'greater',
          'greater_or_equal',
          'between',
          'not_between',
          'is_empty',
          'is_not_empty',
        ],
      },
    },
  },
  datetime: {
    defaultOperator: 'equal',
    widgets: {
      datetime: {
        operators: [
          'equal',
          'not_equal',
          'less',
          'less_or_equal',
          'greater',
          'greater_or_equal',
          'between',
          'not_between',
          'is_empty',
          'is_not_empty',
        ],
      },
    },
  },
  select: {
    mainWidget: 'select',
    defaultOperator: 'select_equals',
    widgets: {
      select: {
        operators: ['select_equals', 'select_not_equals'],
        widgetProps: {
          customProps: {
            showSearch: true,
          },
        },
      },
      multiselect: {
        operators: ['select_any_in', 'select_not_any_in'],
      },
    },
  },
  multiselect: {
    defaultOperator: 'multiselect_equals',
    widgets: {
      multiselect: {
        operators: ['multiselect_equals', 'multiselect_not_equals'],
      },
    },
  },
  boolean: {
    defaultOperator: 'equal',
    widgets: {
      boolean: {
        operators: ['equal', 'not_equal'],
        widgetProps: {
          //you can enable this if you don't use fields as value sources
          // hideOperator: true,
          // operatorInlineLabel: "is",
        },
      },
      field: {
        operators: ['equal', 'not_equal'],
      },
    },
  },
};
