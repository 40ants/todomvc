/* (DEFVAR APP (OR APP (CREATE))) */
var app = app || {  };
/* ((LAMBDA ()
      (SETF (@ APP ALL_TODOS) all
            (@ APP ACTIVE_TODOS) active
            (@ APP COMPLETED_TODOS) completed)
      (DEFVAR *TODO-ITEM (CHAIN *REACT (CREATE-FACTORY (@ APP *TODO-ITEM))))
      (DEFVAR *TODO-FOOTER
        (CHAIN *REACT (CREATE-FACTORY (@ APP *TODO-FOOTER))))
      (LET* ((*ENTER-KEY* 13)
             (MODEL (NEW (CHAIN APP (*TODO-MODEL react-todos)))))
        (DEFCOMPONENT *TODO-APP
         (GET-INITIAL-STATE
          (LAMBDA ()
            (CREATE NOW-SHOWING (@ APP ALL_TODOS) EDITING NIL NEW-TODO ))
          COMPONENT-DID-MOUNT
          (LAMBDA ()
            (LET* ((SET-STATE (@ THIS SET-STATE))
                   (ROUTER
                    (*ROUTER
                     (CREATE /
                      (CHAIN SET-STATE
                       (BIND THIS (CREATE NOW-SHOWING (@ APP ALL_TODOS))))
                      /active
                      (CHAIN SET-STATE
                       (BIND THIS (CREATE NOW-SHOWING (@ APP ACTIVE_TODOS))))
                      /completed
                      (CHAIN SET-STATE
                       (BIND THIS
                        (CREATE NOW-SHOWING (@ APP COMPLETED_TODOS))))))))
              (CHAIN ROUTER (INIT /))))
          HANDLE-CHANGE
          (LAMBDA (EVENT)
            (CHAIN THIS (SET-STATE (CREATE NEW-TODO (@ EVENT TARGET VALUE)))))
          HANDLE-NEW-TODO-KEY-DOWN
          (LAMBDA (EVENT)
            (UNLESS (EQ (@ EVENT KEY-CODE) *ENTER-KEY*) RETURN)
            (CHAIN EVENT (PREVENT-DEFAULT))
            (LET ((VAL (CHAIN THIS STATE NEW-TODO (TRIM))))
              (WHEN VAL
                (CHAIN THIS PROPS MODEL (ADD-TODO VAL))
                (CHAIN THIS (SET-STATE (CREATE NEW-TODO ))))))
          TOGGLE-ALL
          (LAMBDA (EVENT)
            (LET ((CHECKED (@ EVENT TARGET CHECKED)))
              (CHAIN THIS PROPS MODEL (TOGGLE-ALL CHECKED))))
          TOGGLE
          (LAMBDA (TODO-TO-TOGGLE)
            (CHAIN THIS PROPS MODEL (TOGGLE TODO-TO-TOGGLE)))
          DESTROY (LAMBDA (TODO) (CHAIN THIS PROPS MODEL (DESTROY TODO))) EDIT
          (LAMBDA (TODO) (CHAIN THIS (SET-STATE (CREATE EDITING (@ TODO ID)))))
          SAVE
          (LAMBDA (TODO-TO-SAVE TEXT)
            (CHAIN THIS PROPS MODEL (SAVE TODO-TO-SAVE TEXT))
            (CHAIN THIS (SET-STATE (CREATE EDITING NIL))))
          CANCEL (LAMBDA () (CHAIN THIS (SET-STATE (CREATE EDITING NIL))))
          CLEAR-COMPLETED
          (LAMBDA () (CHAIN THIS PROPS MODEL (CLEAR-COMPLETED))))
         (LET* ((FOOTER NIL)
                (MAIN NIL)
                (TODOS (@ THIS PROPS MODEL TODOS))
                (SHOWN-TODOS
                 (CHAIN TODOS
                  (FILTER
                   (LAMBDA (TODO)
                     (SWITCH (@ THIS STATE NOW-SHOWING)
                      ((@ APP ACTIVE_TODOS) (RETURN (NOT (@ TODO COMPLETED))))
                      ((@ APP COMPLETED_TODOS) (RETURN (@ TODO.COMPLETED)))
                      (DEFAULT T)))
                   THIS)))
                (TODO-ITEMS
                 (CHAIN SHOWN-TODOS
                  (MAP
                   (LAMBDA (TODO)
                     (JSL
                      (*TODO-ITEM
                       (CREATE KEY (@ TODO ID) TODO TODO ON-TOGGLE
                        (CHAIN THIS TOGGLE (BIND THIS TODO)) ON-DESTROY
                        (CHAIN THIS DESTROY (BIND THIS TODO)) ON-EDIT
                        (CHAIN THIS EDIT (BIND THIS TODO)) EDITING
                        (EQ (@ THIS STATE EDITING) (@ TODO ID)) ON-SAVE
                        (CHAIN THIS SAVE (BIND THIS TODO)) ON-CANCEL))))
                   THIS)))
                (ACTIVE-TODO-COUNT
                 (CHAIN TODOS
                  (REDUCE
                   (LAMBDA (ACCUM TODO)
                     (IF (@ TODO COMPLETED)
                         ACCUM
                         (1+ ACCUM)))
                   0)))
                (COMPLETED-COUNT (- (@ TODOS LENGTH) ACTIVE-TODO-COUNT)))
           (WHEN (OR ACTIVE-TODO-COUNT COMPLETED-COUNT)
             (SETF FOOTER
                     (*TODO-FOOTER
                      (CREATE COUNT ACTIVE-TODO-COUNT COMPLETED-COUNT
                       COMPLETED-COUNT NOW-SHOWING (@ THIS STATE NOW-SHOWING)
                       ON-CLEAR-COMPLETED (@ THIS CLEAR-COMPLETED)))))
           (WHEN (@ TODOS LENGTH)
             (SETF MAIN
                     (JSL
                      (SECTION CLASS-NAME main
                       (INPUT CLASS-NAME toggle-all TYPE checkbox ON-CHANGE
                        (@ THIS TOGGLE-ALL) CHECKED (EQ ACTIVE-TODO-COUNT 0))
                       (UL CLASS-NAME todo-list TODO-ITEMS)))))
           (JSL
            (DIV
             (HEADER CLASS-NAME header (H1 todos)
              (INPUT CLASS-NAME new-todo PLACEHOLDER What needs to be done?
               VALUE (@ THIS STATE NEW-TODO) ON-KEY-DOWN
               (@ THIS HANDLE-NEW-TODO-KEY-DOWN) ON-CHANGE
               (@ THIS HANDLE-CHANGE) AUTO-FOCUS T))
             MAIN FOOTER))))
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
    var TodoItem = React.createFactory(app.TodoItem);
    var TodoFooter = React.createFactory(app.TodoFooter);
    var ENTERKEY = 13;
    var model = new app.TodoModel('react-todos');
    var TodoApp = React.createClass({ 'displayName' : '*TODO-APP',
                                      'render' : function () {
        var footer = null;
        var main = null;
        var todos1 = this.props.model.todos;
        var shownTodos = todos1.filter(function (todo) {
            switch (this.state.nowShowing) {
            case app['ACTIVE_TODOS']:
                return !todo.completed;
            case app['COMPLETED_TODOS']:
                return todo.completed;
            default:
                return true;
            };
        }, this);
        var todoItems = shownTodos.map(function (todo) {
            return TodoItem({ key : todo.id,
                              todo : todo,
                              onToggle : this.toggle.bind(this, todo),
                              onDestroy : this.destroy.bind(this, todo),
                              onEdit : this.edit.bind(this, todo),
                              editing : this.state.editing === todo.id,
                              onSave : this.save.bind(this, todo),
                              onCancel : null
                            });
        }, this);
        var activeTodoCount = todos1.reduce(function (accum, todo) {
            return todo.completed ? accum : accum + 1;
        }, 0);
        var completedCount = todos1.length - activeTodoCount;
        if (activeTodoCount || completedCount) {
            footer = TodoFooter({ count : activeTodoCount,
                               completedCount : completedCount,
                               nowShowing : this.state.nowShowing,
                               onClearCompleted : this.clearCompleted
                             });
        };
        if (todos1.length) {
            main = React.DOM.section({ className : 'main' }, React.DOM.input({ checked : activeTodoCount === 0,
                                                                            onChange : this.toggleAll,
                                                                            type : 'checkbox',
                                                                            className : 'toggle-all'
                                                                          }), React.DOM.ul({ className : 'todo-list' }, todoItems));
        };
        return React.DOM.div({  }, React.DOM.header({ className : 'header' }, React.DOM.h1({  }, 'todos'), React.DOM.input({ autoFocus : true,
                                                                                                                             onChange : this.handleChange,
                                                                                                                             onKeyDown : this.handleNewTodoKeyDown,
                                                                                                                             value : this.state.newTodo,
                                                                                                                             placeholder : 'What needs to be done?',
                                                                                                                             className : 'new-todo'
                                                                                                                           })), main, footer);
    },
                                      'getInitialState' : function () {
        return { nowShowing : app['ALL_TODOS'],
                 editing : null,
                 newTodo : ''
               };
    },
                                      'componentDidMount' : function () {
        var setState2 = this.setState;
        var router = Router({ '/' : setState2.bind(this, { nowShowing : app['ALL_TODOS'] }),
                              '/active' : setState2.bind(this, { nowShowing : app['ACTIVE_TODOS'] }),
                              '/completed' : setState2.bind(this, { nowShowing : app['COMPLETED_TODOS'] })
                            });
        return router.init('/');
    },
                                      clearCompleted : function () {
        return this.props.model.clearCompleted();
    },
                                      cancel : function () {
        return this.setState({ editing : null });
    },
                                      save : function (todoToSave, text) {
        this.props.model.save(todoToSave, text);
        return this.setState({ editing : null });
    },
                                      edit : function (todo) {
        return this.setState({ editing : todo.id });
    },
                                      destroy : function (todo) {
        return this.props.model.destroy(todo);
    },
                                      toggle : function (todoToToggle) {
        return this.props.model.toggle(todoToToggle);
    },
                                      toggleAll : function (event) {
        var checked3 = event.target.checked;
        return this.props.model.toggleAll(checked3);
    },
                                      handleNewTodoKeyDown : function (event) {
        if (event.keyCode !== ENTERKEY) {
            return;
        };
        event.preventDefault();
        var val = this.state.newTodo.trim();
        if (val) {
            this.props.model.addTodo(val);
            return this.setState({ newTodo : '' });
        };
    },
                                      handleChange : function (event) {
        return this.setState({ newTodo : event.target.value });
    }
                                    });
    function render() {
        return React.render(React.createFactory(TodoApp)({ model : model }), document.getElementsByClassName('todoapp')[0]);
    };
    model.subscribe(render);
    return render();
})();
