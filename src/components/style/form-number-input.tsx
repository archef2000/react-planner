import React, { Component, CSSProperties } from 'react';
import * as SharedStyle from '../../shared-style';
import { MdUpdate } from 'react-icons/md';
import { KEYBOARD_BUTTON_CODE } from '../../constants';
import ReactPlannerContext from '../../react-planner-context';

const STYLE_INPUT = {
  display: 'block',
  width: '100%',
  padding: '0 2px',
  fontSize: '13px',
  lineHeight: '1.25',
  color: SharedStyle.PRIMARY_COLOR.input,
  backgroundColor: SharedStyle.COLORS.white,
  backgroundImage: 'none',
  border: '1px solid rgba(0,0,0,.15)',
  outline: 'none',
  height: '30px',
} as const;

const confirmStyle = {
  position: 'absolute',
  cursor: 'pointer',
  width: '2em',
  height: '2em',
  right: '0.35em',
  top: '0.35em',
  backgroundColor: SharedStyle.SECONDARY_COLOR.main,
  color: '#FFF',
  transition: 'all 0.1s linear'
} as const;

interface FormNumberInputProps {
  value: number,
  style?: CSSProperties,
  onChange: (update: { target: { value: number } }) => void,
  onValid?: (update: Event) => void,
  onInvalid?: (update: Event) => void,
  min?: number,
  max?: number,
  precision?: number,
  placeholder?: string
};

interface FormNumberInputState {
  focus: boolean,
  valid: boolean,
  showedValue: number,
};

export default class FormNumberInput extends Component<FormNumberInputProps, FormNumberInputState> {
  static contextType = ReactPlannerContext;
  context!: React.ContextType<typeof ReactPlannerContext>;

  constructor(props, context) {
    super(props, context);
    this.state = {
      focus: false,
      valid: true,
      showedValue: props.value
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({ showedValue: this.props.value });
    }
  }

  render() {
    const { value = 0, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER, precision = 3, onChange, onValid, onInvalid, style, placeholder } = this.props;
    const numericInputStyle = { ...STYLE_INPUT, ...style };

    if (this.state.focus) numericInputStyle.border = `1px solid ${SharedStyle.SECONDARY_COLOR.main}`;

    const regexp = new RegExp(`^-?([0-9]+)?\\.?([0-9]{0,${precision}})?$`);

    const showedValue = this.state.showedValue;
    if (!isNaN(min) && isFinite(min) && Number(showedValue) < min) this.setState({ showedValue: min }); // value = min;
    if (!isNaN(max) && isFinite(max) && Number(showedValue) > max) this.setState({ showedValue: max }); // value = max;

    const currValue = regexp.test(String(showedValue)) ? String(showedValue) : parseFloat(String(showedValue)).toFixed(precision);

    const different = parseFloat(String(value)).toFixed(precision) !== parseFloat(String(showedValue)).toFixed(precision);

    const saveFn = (e: React.KeyboardEvent | React.MouseEvent) => {
      e.stopPropagation();
      if (this.state.valid) {
        const savedValue = showedValue || 0;
        this.setState({ showedValue: savedValue });
        onChange({ target: { value: savedValue } });
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.state.valid) {
          const newValue = Math.min(Number(showedValue) + 1, max);
          this.setState({ showedValue: newValue });
          onChange({ target: { value: newValue } });
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.state.valid) {
          const newValue = Math.max(Number(showedValue) - 1, min);
          this.setState({ showedValue: newValue });
          onChange({ target: { value: newValue } });
        }
      }
    }

    return (
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={currValue}
          style={numericInputStyle}
          onChange={(evt) => {
            const valid = regexp.test((evt.nativeEvent.target as any).value);

            if (valid) {
              this.setState({ showedValue: (evt.nativeEvent.target as any).value }); //TODO: better event type
              if (onValid) onValid(evt.nativeEvent);
            }
            else {
              if (onInvalid) onInvalid(evt.nativeEvent);
            }

            this.setState({ valid });
          }}
          onFocus={e => this.setState({ focus: true })}
          onBlur={e => this.setState({ focus: false })}
          onKeyDown={e => {
            const keyCode = e.keyCode || e.which;
            if ((keyCode == KEYBOARD_BUTTON_CODE.ENTER || keyCode == KEYBOARD_BUTTON_CODE.TAB) && different) {
              saveFn(e);
            } else {
              handleKeyDown(e);
            }
          }}
          placeholder={placeholder}
        />
        <div
          onClick={e => { if (different) saveFn(e); }}
          title={this.context.translator.t('Confirm')}
          style={{ ...confirmStyle, visibility: different ? 'visible' : 'hidden', opacity: different ? '1' : '0' }}
        >
          <MdUpdate style={{ width: '100%', height: '100%', padding: '0.2em', color: '#FFF' }} />
        </div>
      </div>
    );
  }
}

