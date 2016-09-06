/* (DEFVAR APP (OR APP (CREATE))) */
var app = app || {  };
/* ((LAMBDA ()
      (DEFVAR +ESCAPE-KEY+ 27)
      (DEFVAR +ENTER-KEY+ 13)
      (DEFCLASS *TODO-ITEM (TODO EDITING ON-DESTROY ON-SAVE ON-EDIT ON-TOGGLE)
                (DEFUN HANDLE-SUBMIT (EVENT)
                  (LET ((VAL (CHAIN THIS STATE EDIT-TEXT (TRIM))))
                    (IF VAL
                        (PROGN
                         (ON-SAVE VAL)
                         (SET-STATE (CREATE EDIT-TEXT VAL)))
                        (ON-DESTROY))))
                (DEFUN HANDLE-EDIT ()
                  (ON-EDIT)
                  (SET-STATE (CREATE EDIT-TEXT (@ TODO TITLE))))
                (DEFUN HANDLE-KEY-DOWN (EVENT)
                  (WHEN (= EVENT.WHICH +ESCAPE-KEY+)
                    (SET-STATE (CREATE EDIT-TEXT (@ TODO TITLE)))
                    (ON-CANCEL EVENT))
                  (WHEN (= EVENT.WHICH +ENTER-KEY+)
                    (CHAIN THIS (HANDLE-SUBMIT EVENT))))
                (DEFUN HANDLE-CHANGE (EVENT)
                  (WHEN EDITING
                    (SET-STATE (CREATE EDIT-TEXT EVENT.TARGET.VALUE))))
                (DEFUN GET-INITIAL-STATE () (CREATE EDIT-TEXT (@ TODO TITLE)))
                (DEFUN SHOULD-COMPONENT-UPDATE (NEXT-PROPS NEXT-STATE)
                  (OR (NOT (EQ (@ NEXT-PROPS TODO) (@ THIS PROPS TODO)))
                      (NOT (EQ (@ NEXT-PROPS EDITING) (@ THIS PROPS EDITING)))
                      (NOT
                       (EQ (@ NEXT-STATE EDIT-TEXT)
                           (@ THIS STATE EDIT-TEXT)))))
                (DEFUN COMPONENT-DID-UPDATE (PREV-PROPS)
                  (WHEN (AND (NOT (@ PREV-PROPS EDITING)) EDITING)
                    (LET* ((NODE
                            (CHAIN *REACT
                             (FIND-D-O-M-NODE (@ THIS REFS EDIT-FIELD))))
                           (VALUE-LENGTH (@ NODE VALUE LENGTH)))
                      (CHAIN NODE (FOCUS))
                      (CHAIN NODE
                       (SET-SELECTION-RANGE VALUE-LENGTH VALUE-LENGTH)))))
                (DEFUN RENDER ()
                  (JSL
                   (LI CLASS-NAME
                    (CLASS-NAMES
                     (CREATE COMPLETED (@ TODO COMPLETED) EDITING EDITING))
                    (DIV CLASS-NAME view
                     (INPUT CLASS-NAME toggle TYPE checkbox CHECKED
                      (@ TODO COMPLETED) ON-CHANGE ON-TOGGLE)
                     (LABEL ON-DOUBLE-CLICK HANDLE-EDIT (@ TODO TITLE))
                     (BUTTON CLASS-NAME destroy ON-CLICK ON-DESTROY))
                    (INPUT REF editField CLASS-NAME edit VALUE
                     (@ THIS STATE EDIT-TEXT) ON-BLUR HANDLE-SUBMIT ON-CHANGE
                     HANDLE-CHANGE ON-KEY-DOWN HANDLE-KEY-DOWN)))))
      (SETF (AREF APP TodoItem) *TODO-ITEM))) */
(function () {
    var ESCAPEKEY = 27;
    var ENTERKEY = 13;
    var TodoItem = React.createClass({ handleSubmit : function (event) {
        var g582 = this;
        var val = g582.state.editText.trim();
        if (val) {
            g582.props.onSave(val);
            return g582.setState({ editText : val });
        } else {
            return g582.props.onDestroy();
        };
    },
                                       handleEdit : function () {
        var g583 = this;
        g583.props.onEdit();
        return g583.setState({ editText : g583.props.todo.title });
    },
                                       handleKeyDown : function (event) {
        var g584 = this;
        if (event.which === ESCAPEKEY) {
            g584.setState({ editText : g584.props.todo.title });
            onCancel(event);
        };
        return event.which === ENTERKEY ? g584.handleSubmit(event) : null;
    },
                                       handleChange : function (event) {
        var g585 = this;
        return g585.props.editing ? g585.setState({ editText : event.target.value }) : null;
    },
                                       getInitialState : function () {
        var g586 = this;
        return { editText : g586.props.todo.title };
    },
                                       shouldComponentUpdate : function (nextProps, nextState) {
        var g587 = this;
        return nextProps.todo !== g587.props.todo || nextProps.editing !== g587.props.editing || nextState.editText !== g587.state.editText;
    },
                                       componentDidUpdate : function (prevProps) {
        var g588 = this;
        if (!prevProps.editing && g588.props.editing) {
            var node = React.findDOMNode(g588.refs.editField);
            var valueLength = node.value.length;
            node.focus();
            return node.setSelectionRange(valueLength, valueLength);
        };
    },
                                       render : function () {
        var g589 = this;
        return React.DOM.li({ className : classNames({ completed : g589.props.todo.completed, editing : g589.props.editing }) }, React.DOM.div({ className : 'view' }, React.DOM.input({ onChange : g589.props.onToggle,
                                                                                                                                                                                         checked : g589.props.todo.completed,
                                                                                                                                                                                         type : 'checkbox',
                                                                                                                                                                                         className : 'toggle'
                                                                                                                                                                                       }), React.DOM.label({ onDoubleClick : g589.handleEdit }, g589.props.todo.title), React.DOM.button({ onClick : g589.props.onDestroy, className : 'destroy' })), React.DOM.input({ onKeyDown : g589.handleKeyDown,
                                                                                                                                                                                                                                                                                                                                                                        onChange : g589.handleChange,
                                                                                                                                                                                                                                                                                                                                                                        onBlur : g589.handleSubmit,
                                                                                                                                                                                                                                                                                                                                                                        value : g589.state.editText,
                                                                                                                                                                                                                                                                                                                                                                        className : 'edit',
                                                                                                                                                                                                                                                                                                                                                                        ref : 'editField'
                                                                                                                                                                                                                                                                                                                                                                      }));
    }
                                     });
    return app['TodoItem'] = TodoItem;
})();
