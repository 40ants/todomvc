/* (DEFVAR APP (OR APP (CREATE))) */
var app = app || {  };
/* ((LAMBDA ()
      (DEFVAR +ESCAPE-KEY+ 27)
      (DEFVAR +ENTER-KEY+ 13)
      (DEFCOMPONENT *TODO-ITEM
       (HANDLE-SUBMIT
        (LAMBDA (EVENT)
          (LET ((VAL (CHAIN THIS STATE EDIT-TEXT (TRIM))))
            (IF VAL
                (PROGN
                 (CHAIN THIS PROPS (ON-SAVE VAL))
                 (CHAIN THIS (SET-STATE (CREATE EDIT-TEXT VAL))))
                (CHAIN THIS PROPS (ON-DESTROY)))))
        HANDLE-EDIT
        (LAMBDA ()
          (CHAIN THIS PROPS (ON-EDIT))
          (CHAIN THIS
           (SET-STATE (CREATE EDIT-TEXT (@ THIS PROPS TODO TITLE)))))
        HANDLE-KEY-DOWN
        (LAMBDA (EVENT)
          (WHEN (= EVENT.WHICH +ESCAPE-KEY+)
            (CHAIN THIS
             (SET-STATE (CREATE EDIT-TEXT (@ THIS PROPS TODO TITLE))))
            (CHAIN THIS PROPS (ON-CANCEL EVENT)))
          (WHEN (= EVENT.WHICH +ENTER-KEY+)
            (CHAIN THIS (HANDLE-SUBMIT EVENT))))
        HANDLE-CHANGE
        (LAMBDA (EVENT)
          (WHEN THIS.PROPS.EDITING
            (CHAIN THIS (SET-STATE (CREATE EDIT-TEXT EVENT.TARGET.VALUE)))))
        GET-INITIAL-STATE
        (LAMBDA () (CREATE EDIT-TEXT (@ THIS PROPS TODO TITLE)))
        SHOULD-COMPONENT-UPDATE
        (LAMBDA (NEXT-PROPS NEXT-STATE)
          (OR (NOT (EQ (@ NEXT-PROPS TODO) (@ THIS PROPS TODO)))
              (NOT (EQ (@ NEXT-PROPS EDITING) (@ THIS PROPS EDITING)))
              (NOT (EQ (@ NEXT-STATE EDIT-TEXT) (@ THIS STATE EDIT-TEXT)))))
        COMPONENT-DID-UPDATE
        (LAMBDA (PREV-PROPS)
          (WHEN (AND (NOT (@ PREV-PROPS EDITING)) (@ THIS PROPS EDITING))
            (LET* ((NODE
                    (CHAIN *REACT (FIND-D-O-M-NODE (@ THIS REFS EDIT-FIELD))))
                   (VALUE-LENGTH (@ NODE VALUE LENGTH)))
              (CHAIN NODE (FOCUS))
              (CHAIN NODE (SET-SELECTION-RANGE VALUE-LENGTH VALUE-LENGTH))))))
       (JSL
        (LI CLASS-NAME
         (CLASS-NAMES
          (CREATE COMPLETED (@ THIS.PROPS.TODO.COMPLETED) EDITING
           (@ THIS.PROPS.EDITING)))
         (DIV CLASS-NAME view
          (INPUT CLASS-NAME toggle TYPE checkbox CHECKED
           (@ THIS PROPS TODO COMPLETED) ON-CHANGE (@ THIS PROPS ON-TOGGLE))
          (LABEL ON-DOUBLE-CLICK (@ THIS HANDLE-EDIT)
           (@ THIS PROPS TODO TITLE))
          (BUTTON CLASS-NAME destroy ON-CLICK (@ THIS PROPS ON-DESTROY)))
         (INPUT REF editField CLASS-NAME edit VALUE (@ THIS STATE EDIT-TEXT)
          ON-BLUR (@ THIS HANDLE-SUBMIT) ON-CHANGE (@ THIS HANDLE-CHANGE)
          ON-KEY-DOWN (@ THIS HANDLE-KEY-DOWN)))))
      (SETF (AREF APP TodoItem) *TODO-ITEM))) */
(function () {
    var ESCAPEKEY = 27;
    var ENTERKEY = 13;
    var TodoItem = React.createClass({ 'displayName' : '*TODO-ITEM',
                                       'render' : function () {
        return React.DOM.li({ className : classNames({ completed : this.props.todo.completed, editing : this.props.editing }) }, React.DOM.div({ className : 'view' }, React.DOM.input({ onChange : this.props.onToggle,
                                                                                                                                                                                         checked : this.props.todo.completed,
                                                                                                                                                                                         type : 'checkbox',
                                                                                                                                                                                         className : 'toggle'
                                                                                                                                                                                       }), React.DOM.label({ onDoubleClick : this.handleEdit }, this.props.todo.title), React.DOM.button({ onClick : this.props.onDestroy, className : 'destroy' })), React.DOM.input({ onKeyDown : this.handleKeyDown,
                                                                                                                                                                                                                                                                                                                                                                        onChange : this.handleChange,
                                                                                                                                                                                                                                                                                                                                                                        onBlur : this.handleSubmit,
                                                                                                                                                                                                                                                                                                                                                                        value : this.state.editText,
                                                                                                                                                                                                                                                                                                                                                                        className : 'edit',
                                                                                                                                                                                                                                                                                                                                                                        ref : 'editField'
                                                                                                                                                                                                                                                                                                                                                                      }));
    },
                                       componentDidUpdate : function (prevProps) {
        if (!prevProps.editing && this.props.editing) {
            var node = React.findDOMNode(this.refs.editField);
            var valueLength = node.value.length;
            node.focus();
            return node.setSelectionRange(valueLength, valueLength);
        };
    },
                                       shouldComponentUpdate : function (nextProps, nextState) {
        return nextProps.todo !== this.props.todo || nextProps.editing !== this.props.editing || nextState.editText !== this.state.editText;
    },
                                       getInitialState : function () {
        return { editText : this.props.todo.title };
    },
                                       handleChange : function (event) {
        return this.props.editing ? this.setState({ editText : event.target.value }) : null;
    },
                                       handleKeyDown : function (event) {
        if (event.which === ESCAPEKEY) {
            this.setState({ editText : this.props.todo.title });
            this.props.onCancel(event);
        };
        return event.which === ENTERKEY ? this.handleSubmit(event) : null;
    },
                                       handleEdit : function () {
        this.props.onEdit();
        return this.setState({ editText : this.props.todo.title });
    },
                                       handleSubmit : function (event) {
        var val = this.state.editText.trim();
        if (val) {
            this.props.onSave(val);
            return this.setState({ editText : val });
        } else {
            return this.props.onDestroy();
        };
    }
                                     });
    return app['TodoItem'] = TodoItem;
})();
