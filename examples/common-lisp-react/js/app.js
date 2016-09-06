/* (DEFVAR APP (OR APP (CREATE))) */
var app = app || {  };
/* ((LAMBDA ()
      (SETF (@ APP ALL_TODOS) all
            (@ APP ACTIVE_TODOS) active
            (@ APP COMPLETED_TODOS) completed)
      (DEFVAR *TODO-ITEM (@ APP *TODO-ITEM))
      (DEFVAR *TODO-FOOTER
        (CHAIN *REACT (CREATE-FACTORY (@ APP *TODO-FOOTER))))
      (LET* ((*ENTER-KEY* 13)
             (MODEL (NEW (CHAIN APP (*TODO-MODEL react-todos)))))
        (DEFCLASS *TODO-APP (MODEL)
                  (DEFUN GET-INITIAL-STATE ()
                    (CREATE NOW-SHOWING (@ APP ALL_TODOS) EDITING NIL NEW-TODO
                     ))
                  (DEFUN COMPONENT-DID-MOUNT ()
                    (LET* ((ROUTER
                            (*ROUTER
                             (CREATE /
                              (LAMBDA ()
                                (SET-STATE
                                 (CREATE NOW-SHOWING (@ APP ALL_TODOS))))
                              /active
                              (LAMBDA ()
                                (SET-STATE
                                 (CREATE NOW-SHOWING (@ APP ACTIVE_TODOS))))
                              /completed
                              (LAMBDA ()
                                (SET-STATE
                                 (CREATE NOW-SHOWING
                                  (@ APP COMPLETED_TODOS))))))))
                      (CHAIN ROUTER (INIT /))))
                  (DEFUN HANDLE-CHANGE (EVENT)
                    (CONSOLE.LOG Handling change)
                    (SET-STATE (CREATE NEW-TODO (@ EVENT TARGET VALUE))))
                  (DEFUN HANDLE-NEW-TODO-KEY-DOWN (EVENT)
                    (UNLESS (EQ (@ EVENT KEY-CODE) *ENTER-KEY*) RETURN)
                    (CHAIN EVENT (PREVENT-DEFAULT))
                    (LET ((VAL (CHAIN THIS STATE NEW-TODO (TRIM))))
                      (WHEN VAL
                        (CHAIN MODEL (ADD-TODO VAL))
                        (SET-STATE (CREATE NEW-TODO )))))
                  (DEFUN TOGGLE-ALL (EVENT)
                    (CONSOLE.LOG Toggling all items)
                    (LET ((CHECKED (@ EVENT TARGET CHECKED)))
                      (CHAIN MODEL (TOGGLE-ALL CHECKED))))
                  (DEFUN TOGGLE (TODO-TO-TOGGLE)
                    (CONSOLE.LOG Toggling item)
                    (CHAIN MODEL (TOGGLE TODO-TO-TOGGLE)))
                  (DEFUN DESTROY (TODO)
                    (CONSOLE.LOG Destroying item)
                    (CHAIN MODEL (DESTROY TODO)))
                  (DEFUN EDIT (TODO)
                    (CONSOLE.LOG Editing item)
                    (SET-STATE (CREATE EDITING (@ TODO ID))))
                  (DEFUN SAVE (TODO-TO-SAVE TEXT)
                    (CONSOLE.LOG Saving item TODO-TO-SAVE TEXT)
                    (CHAIN MODEL (SAVE TODO-TO-SAVE TEXT))
                    (SET-STATE (CREATE EDITING NIL)))
                  (DEFUN CANCEL ()
                    (CONSOLE.LOG Canceling editing)
                    (SET-STATE (CREATE EDITING NIL)))
                  (DEFUN CLEAR-COMPLETED ()
                    (CONSOLE.LOG Cliearing completed)
                    (CHAIN MODEL (CLEAR-COMPLETED)))
                  (DEFUN RENDER ()
                    (LET* ((FOOTER NIL)
                           (MAIN NIL)
                           (TODOS (@ MODEL TODOS))
                           (SHOWN-TODOS
                            (CHAIN TODOS
                             (FILTER
                              (LAMBDA (TODO)
                                (SWITCH (@ THIS STATE NOW-SHOWING)
                                 ((@ APP ACTIVE_TODOS)
                                  (RETURN (NOT (@ TODO COMPLETED))))
                                 ((@ APP COMPLETED_TODOS)
                                  (RETURN (@ TODO.COMPLETED)))
                                 (DEFAULT T)))
                              THIS)))
                           (TODO-ITEMS
                            (CHAIN SHOWN-TODOS
                             (MAP
                              (LAMBDA (TODO)
                                (JSL
                                 (*TODO-ITEM
                                  (CREATE KEY (@ TODO ID) TODO TODO EDITING
                                   (EQ (@ THIS STATE EDITING) (@ TODO ID))
                                   ON-TOGGLE (LAMBDA () (TOGGLE TODO))
                                   ON-DESTROY (LAMBDA () (DESTROY TODO))
                                   ON-EDIT (LAMBDA () (EDIT TODO)) ON-SAVE
                                   (LAMBDA (TEXT) (SAVE TODO TEXT)) ON-CANCEL
                                   CANCEL))))
                              THIS)))
                           (ACTIVE-TODO-COUNT
                            (CHAIN TODOS
                             (REDUCE
                              (LAMBDA (ACCUM TODO)
                                (IF (@ TODO COMPLETED)
                                    ACCUM
                                    (1+ ACCUM)))
                              0)))
                           (COMPLETED-COUNT
                            (- (@ TODOS LENGTH) ACTIVE-TODO-COUNT)))
                      (WHEN (OR ACTIVE-TODO-COUNT COMPLETED-COUNT)
                        (SETF FOOTER
                                (*TODO-FOOTER
                                 (CREATE COUNT ACTIVE-TODO-COUNT
                                  COMPLETED-COUNT COMPLETED-COUNT NOW-SHOWING
                                  (@ THIS STATE NOW-SHOWING) ON-CLEAR-COMPLETED
                                  (@ THIS CLEAR-COMPLETED)))))
                      (WHEN (@ TODOS LENGTH)
                        (SETF MAIN
                                (JSL
                                 (SECTION CLASS-NAME main
                                  (INPUT CLASS-NAME toggle-all TYPE checkbox
                                   ON-CHANGE (@ THIS TOGGLE-ALL) CHECKED
                                   (EQ ACTIVE-TODO-COUNT 0))
                                  (UL CLASS-NAME todo-list TODO-ITEMS)))))
                      (JSL
                       (DIV
                        (HEADER CLASS-NAME header (H1 todos)
                         (INPUT CLASS-NAME new-todo PLACEHOLDER
                          What needs to be done? VALUE (@ THIS STATE NEW-TODO)
                          ON-KEY-DOWN (@ THIS HANDLE-NEW-TODO-KEY-DOWN)
                          ON-CHANGE (@ THIS HANDLE-CHANGE) AUTO-FOCUS T))
                        MAIN FOOTER)))))
        (DEFUN RENDER ()
          (CHAIN *REACT
           (RENDER
            (JSL
             ((CHAIN *REACT (CREATE-FACTORY *TODO-APP)) (CREATE MODEL MODEL)))
            (CHAIN DOCUMENT (GET-ELEMENTS-BY-CLASS-NAME todoapp) 0))))
        (CHAIN MODEL (SUBSCRIBE RENDER))
        (RENDER)))) */
(function () {
    app['ALL_TODOS'] = 'all';
    app['ACTIVE_TODOS'] = 'active';
    app['COMPLETED_TODOS'] = 'completed';
    var TodoItem = app.TodoItem;
    var TodoFooter = React.createFactory(app.TodoFooter);
    var ENTERKEY = 13;
    var model = new app.TodoModel('react-todos');
    var TodoApp = React.createClass({ getInitialState : function () {
        var g582 = this;
        return { nowShowing : app['ALL_TODOS'],
                 editing : null,
                 newTodo : ''
               };
    },
                                      componentDidMount : function () {
        var g583 = this;
        var router = Router({ '/' : function () {
            return g583.setState({ nowShowing : app['ALL_TODOS'] });
        },
                              '/active' : function () {
            return g583.setState({ nowShowing : app['ACTIVE_TODOS'] });
        },
                              '/completed' : function () {
            return g583.setState({ nowShowing : app['COMPLETED_TODOS'] });
        }
                            });
        return router.init('/');
    },
                                      handleChange : function (event) {
        var g584 = this;
        console.log('Handling change');
        return g584.setState({ newTodo : event.target.value });
    },
                                      handleNewTodoKeyDown : function (event) {
        var g585 = this;
        if (event.keyCode !== ENTERKEY) {
            return;
        };
        event.preventDefault();
        var val = g585.state.newTodo.trim();
        if (val) {
            g585.props.model.addTodo(val);
            return g585.setState({ newTodo : '' });
        };
    },
                                      toggleAll : function (event) {
        var g586 = this;
        console.log('Toggling all items');
        var checked1 = event.target.checked;
        return g586.props.model.toggleAll(checked1);
    },
                                      toggle : function (todoToToggle) {
        var g587 = this;
        console.log('Toggling item');
        return g587.props.model.toggle(todoToToggle);
    },
                                      destroy : function (todo) {
        var g588 = this;
        console.log('Destroying item');
        return g588.props.model.destroy(todo);
    },
                                      edit : function (todo) {
        var g589 = this;
        console.log('Editing item');
        return g589.setState({ editing : todo.id });
    },
                                      save : function (todoToSave, text) {
        var g590 = this;
        console.log('Saving item', todoToSave, text);
        g590.props.model.save(todoToSave, text);
        return g590.setState({ editing : null });
    },
                                      cancel : function () {
        var g591 = this;
        console.log('Canceling editing');
        return g591.setState({ editing : null });
    },
                                      clearCompleted : function () {
        var g592 = this;
        console.log('Cliearing completed');
        return g592.props.model.clearCompleted();
    },
                                      render : function () {
        var g593 = this;
        var footer = null;
        var main = null;
        var todos2 = g593.props.model.todos;
        var shownTodos = todos2.filter(function (todo) {
            switch (g593.state.nowShowing) {
            case app['ACTIVE_TODOS']:
                return !todo.completed;
            case app['COMPLETED_TODOS']:
                return todo.completed;
            default:
                return true;
            };
        }, g593);
        var todoItems = shownTodos.map(function (todo) {
            return TodoItem({ key : todo.id,
                              todo : todo,
                              editing : g593.state.editing === todo.id,
                              onToggle : function () {
                return g593.toggle(todo);
            },
                              onDestroy : function () {
                return g593.destroy(todo);
            },
                              onEdit : function () {
                return g593.edit(todo);
            },
                              onSave : function (text) {
                return g593.save(todo, text);
            },
                              onCancel : g593.cancel
                            });
        }, g593);
        var activeTodoCount = todos2.reduce(function (accum, todo) {
            return todo.completed ? accum : accum + 1;
        }, 0);
        var completedCount = todos2.length - activeTodoCount;
        if (activeTodoCount || completedCount) {
            footer = TodoFooter({ count : activeTodoCount,
                               completedCount : completedCount,
                               nowShowing : g593.state.nowShowing,
                               onClearCompleted : g593.clearCompleted
                             });
        };
        if (todos2.length) {
            main = React.DOM.section({ className : 'main' }, React.DOM.input({ checked : activeTodoCount === 0,
                                                                            onChange : g593.toggleAll,
                                                                            type : 'checkbox',
                                                                            className : 'toggle-all'
                                                                          }), React.DOM.ul({ className : 'todo-list' }, todoItems));
        };
        return React.DOM.div({  }, React.DOM.header({ className : 'header' }, React.DOM.h1({  }, 'todos'), React.DOM.input({ autoFocus : true,
                                                                                                                             onChange : g593.handleChange,
                                                                                                                             onKeyDown : g593.handleNewTodoKeyDown,
                                                                                                                             value : g593.state.newTodo,
                                                                                                                             placeholder : 'What needs to be done?',
                                                                                                                             className : 'new-todo'
                                                                                                                           })), main, footer);
    }
                                    });
    function render() {
        return React.render(React.createFactory(TodoApp)({ model : model }), document.getElementsByClassName('todoapp')[0]);
    };
    model.subscribe(render);
    return render();
})();
