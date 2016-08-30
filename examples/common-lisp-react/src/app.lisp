(quickload "panic")

(defvar app (or app (create)))


((lambda ()
   (setf (@ app "ALL_TODOS") "all"
         (@ app "ACTIVE_TODOS") "active"
         (@ app "COMPLETED_TODOS") "completed")

   (defvar *todo-item (chain *react (create-factory
                                     (@ app *todo-item))))
   (defvar *todo-footer (chain *react (create-factory
                                       (@ app *todo-footer))))

   
   (let* (
          (*enter-key* 13)
          (model (new (chain app (*todo-model "react-todos")))))

     (panic:defcomponent *todo-app
         (:get-initial-state
          (lambda ()
            (create now-showing (@ app "ALL_TODOS")
                    editing nil
                    new-todo ""))

          :component-did-mount
          (lambda ()
            (let* ((set-state (@ this set-state))
                   (router (*router
                            (create "/"
                                    (chain set-state (bind this (create now-showing (@ app "ALL_TODOS"))))
                                    "/active"
                                    (chain set-state (bind this (create now-showing (@ app "ACTIVE_TODOS"))))
                                    "/completed"
                                    (chain set-state (bind this (create now-showing (@ app "COMPLETED_TODOS"))))))))
              (chain router (init "/"))))

          :handle-change
          (lambda (event)
            (chain this (set-state (create new-todo (@ event target value)))))

          :handle-new-todo-key-down
          (lambda (event)
            (unless (eq (@ event key-code) *enter-key*)
              return)
            (chain event (prevent-default))
            
            (let ((val (chain this state new-todo (trim))))
              (when val
                (chain this props model (add-todo val))
                (chain this (set-state (create new-todo ""))))))

          :toggle-all
          (lambda (event)
            (let ((checked (@ event target checked)))
              (chain this props model (toggle-all checked))))

          :toggle
          (lambda (todo-to-toggle)
            (chain this props model (toggle todo-to-toggle)))

          :destroy
          (lambda (todo)
            (chain this props model (destroy todo)))

          :edit
          (lambda (todo)
            (chain this (set-state (create editing (@ todo id)))))

          :save
          (lambda (todo-to-save text)
            (chain this props model (save todo-to-save text))
            (chain this (set-state (create editing nil))))

          :cancel
          (lambda ()
            (chain this (set-state (create editing nil))))

          :clear-completed
          (lambda ()
            (chain this props model (clear-completed))))

       (let* ((footer nil)
              (main nil)
              (todos (@ this props model todos))
              (shown-todos (chain todos (filter (lambda (todo)
                                                  (switch (@ this state now-showing)
                                                    ((@ app "ACTIVE_TODOS")
                                                     (return (not (@ todo completed))))
                                                    ((@ app "COMPLETED_TODOS")
                                                     (return (@ todo.completed)))
                                                    (default t)))
                                                this)))
              (todo-items (chain shown-todos (map (lambda (todo)
                                                    (panic:jsl
                                                     (*todo-item (create key (@ todo id)
                                                                         todo todo
                                                                         on-toggle (chain this toggle (bind this todo))
                                                                         on-destroy (chain this destroy (bind this todo))
                                                                         on-edit (chain this edit (bind this todo))
                                                                         editing (eq (@ this state editing)
                                                                                      (@ todo id))
                                                                         on-save (chain this save (bind this todo))
                                                                         on-cancel))))
                                                  this)))
              (active-todo-count (chain todos (reduce (lambda (accum todo)
                                                        (if (@ todo completed)
                                                            accum
                                                            (1+ accum)))
                                                      0)))
              (completed-count (- (@ todos length)
                                  active-todo-count)))

         (when (or active-todo-count
                   completed-count)
           (setf footer (*todo-footer (create count active-todo-count
                                              completed-count completed-count
                                              now-showing (@ this state now-showing)
                                              on-clear-completed (@ this clear-completed)))))

         (when (@ todos length)
           (setf main (panic:jsl
                       (:section :class-name "main"
                                 (:input :class-name "toggle-all"
                                         :type "checkbox"
                                         :on-change (@ this toggle-all)
                                         :checked (eq active-todo-count 0))
                                 (:ul :class-name "todo-list"
                                      todo-items)))))

         (panic:jsl
          (:div
           (:header :class-name "header"
                    (:h1 "todos")
                    (:input :class-name "new-todo"
                            :placeholder "What needs to be done?"
                            :value (@ this state new-todo)
                            :on-key-down (@ this handle-new-todo-key-down)
                            :on-change (@ this handle-change)
                            :auto-focus t))
           main
           footer))))
     
     (defun render ()
       (chain *react (render
                      (panic:jsl
                       ((chain *react (create-factory *todo-app)) (create model model)))
                      (chain document (get-elements-by-class-name "todoapp") 0))))
     (chain model (subscribe render))
     (render))))
