/* (DEFVAR APP (OR APP (CREATE))) */
var app = app || {  };
/* ((LAMBDA ()
      (SETF (@ APP TodoModel)
              (LAMBDA (KEY)
                (SETF (@ THIS KEY) KEY
                      (@ THIS TODOS) (CHAIN APP UTILS (STORE KEY))
                      (@ THIS ON-CHANGES) 'NIL)
                THIS)
            (@ APP TodoModel PROTOTYPE SUBSCRIBE)
              (LAMBDA (ON-CHANGE) (CHAIN THIS ON-CHANGES (PUSH ON-CHANGE)))
            (@ APP TodoModel PROTOTYPE INFORM)
              (LAMBDA ()
                (CHAIN APP UTILS (STORE (@ THIS KEY) (@ THIS TODOS)))
                (CHAIN THIS ON-CHANGES (FOR-EACH (LAMBDA (CB) (CB)))))
            (@ APP TodoModel PROTOTYPE ADD-TODO)
              (LAMBDA (TITLE)
                (SETF (@ THIS TODOS)
                        (CHAIN THIS TODOS
                         (CONCAT
                          (CREATE ID (CHAIN APP UTILS (UUID)) TITLE TITLE
                           COMPLETED FALSE))))
                (CHAIN THIS (INFORM)))
            (@ APP TodoModel PROTOTYPE TOGGLE-ALL)
              (LAMBDA (CHECKED)
                (SETF (@ THIS TODOS)
                        (CHAIN THIS TODOS
                         (MAP
                          (LAMBDA (TODO)
                            (CHAIN APP UTILS
                             (EXTEND TODO (CREATE COMPLETED CHECKED)))))))
                (CHAIN THIS (INFORM)))
            (@ APP TodoModel PROTOTYPE TOGGLE)
              (LAMBDA (TODO-TO-TOGGLE)
                (SETF (@ THIS TODOS)
                        (CHAIN THIS TODOS
                         (MAP
                          (LAMBDA (TODO)
                            (IF (EQ TODO TODO-TO-TOGGLE)
                                (CHAIN APP UTILS
                                 (EXTEND TODO
                                  (CREATE COMPLETED (NOT (@ TODO COMPLETED)))))
                                TODO)))))
                (CHAIN THIS (INFORM)))
            (@ APP TodoModel PROTOTYPE DESTROY)
              (LAMBDA (TODO)
                (SETF (@ THIS TODOS)
                        (CHAIN THIS TODOS
                         (FILTER
                          (LAMBDA (CANDIDATE) (NOT (EQ CANDIDATE TODO))))))
                (CHAIN THIS (INFORM)))
            (@ APP TodoModel PROTOTYPE SAVE)
              (LAMBDA (TODO-TO-SAVE TEXT)
                (SETF (@ THIS TODOS)
                        (CHAIN THIS TODOS
                         (MAP
                          (LAMBDA (TODO)
                            (IF (EQ TODO TODO-TO-SAVE)
                                (CHAIN APP UTILS
                                 (EXTEND TODO (CREATE TITLE TEXT)))
                                TODO)))))
                (CHAIN THIS (INFORM)))
            (@ APP TodoModel PROTOTYPE CLEAR-COMPLETED)
              (LAMBDA ()
                (SETF (@ THIS TODOS)
                        (CHAIN THIS TODOS
                         (FILTER (LAMBDA (TODO) (NOT (@ TODO COMPLETED))))))
                (CHAIN THIS (INFORM)))))) */
(function () {
    app['TodoModel'] = function (key) {
        this.key = key;
        this.todos = app.utils.store(key);
        this.onChanges = [];
        return this;
    };
    app['TodoModel'].prototype.subscribe = function (onChange) {
        return this.onChanges.push(onChange);
    };
    app['TodoModel'].prototype.inform = function () {
        app.utils.store(this.key, this.todos);
        return this.onChanges.forEach(function (cb) {
            return cb();
        });
    };
    app['TodoModel'].prototype.addTodo = function (title) {
        this.todos = this.todos.concat({ id : app.utils.uuid(),
                                      title : title,
                                      completed : false
                                    });
        return this.inform();
    };
    app['TodoModel'].prototype.toggleAll = function (checked) {
        this.todos = this.todos.map(function (todo) {
            return app.utils.extend(todo, { completed : checked });
        });
        return this.inform();
    };
    app['TodoModel'].prototype.toggle = function (todoToToggle) {
        this.todos = this.todos.map(function (todo) {
            return todo === todoToToggle ? app.utils.extend(todo, { completed : !todo.completed }) : todo;
        });
        return this.inform();
    };
    app['TodoModel'].prototype.destroy = function (todo) {
        this.todos = this.todos.filter(function (candidate) {
            return candidate !== todo;
        });
        return this.inform();
    };
    app['TodoModel'].prototype.save = function (todoToSave, text) {
        this.todos = this.todos.map(function (todo) {
            return todo === todoToSave ? app.utils.extend(todo, { title : text }) : todo;
        });
        return this.inform();
    };
    return app['TodoModel'].prototype.clearCompleted = function () {
        this.todos = this.todos.filter(function (todo) {
            return !todo.completed;
        });
        return this.inform();
    };
})();
