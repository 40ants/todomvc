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


   (let* ((*enter-key* 13)
          (model (new (chain app (*todo-model "react-todos")))))

     (panic:defclass *todo-app (model)

       (defun get-initial-state ()
         (create now-showing (@ app "ALL_TODOS")
                 editing nil
                 new-todo ""))


       (defun component-did-mount ()
         (let* (
                (router (*router
                         (create "/"
                                 (lambda () (set-state (create now-showing (@ app "ALL_TODOS"))))
                                 "/active"
                                 (lambda () (set-state (create now-showing (@ app "ACTIVE_TODOS"))))
                                 "/completed"
                                 (lambda () (set-state (create now-showing (@ app "COMPLETED_TODOS"))))))))
           (chain router (init "/"))))


       (defun handle-change (event)
         (console.log "Handling change")
         (set-state (create new-todo (@ event target value))))


       (defun handle-new-todo-key-down (event)
         (unless (eq (@ event key-code) *enter-key*)
           return)
         (chain event (prevent-default))

         (let ((val (chain this state new-todo (trim))))
           (when val
             (chain model (add-todo val))
             (set-state (create new-todo "")))))


       (defun toggle-all (event)
         (console.log "Toggling all items")
         (let ((checked (@ event target checked)))
           (chain model (toggle-all checked))))


       (defun toggle (todo-to-toggle)
         (console.log "Toggling item")
         (chain model (toggle todo-to-toggle)))


       (defun destroy (todo)
         (console.log "Destroying item")
         (chain model (destroy todo)))


       (defun edit (todo)
         (console.log "Editing item")
         (set-state (create editing (@ todo id))))

       
       (defun save (todo-to-save text)
         (console.log "Saving item" todo-to-save text)
         (chain model (save todo-to-save text))
         (set-state (create editing nil)))

       
       (defun cancel ()
         (console.log "Canceling editing")
         (set-state (create editing nil)))

       
       (defun clear-completed ()
         (console.log "Cliearing completed")
         (chain model (clear-completed)))

       (defun render ()
         (let* ((footer nil)
                (main nil)
                (todos (@ model todos))
                (shown-todos (chain todos (filter (lambda (todo)
                                                    (switch (@ this state now-showing)
                                                      ((@ app "ACTIVE_TODOS")
                                                       (return (not (@ todo completed))))
                                                      ((@ app "COMPLETED_TODOS")
                                                       (return (@ todo.completed)))
                                                      (default t))))))
                (todo-items (chain shown-todos (map (lambda (todo)
                                                      (panic:jsl
                                                       (*todo-item (create key (@ todo id)
                                                                           todo todo
                                                                           editing (eq (@ this state editing)
                                                                                       (@ todo id))
                                                                           on-toggle  (lambda () (toggle todo))
                                                                           on-destroy (lambda () (destroy todo))
                                                                           on-edit    (lambda () (edit todo))
                                                                           on-save    (lambda (text) (save todo text))
                                                                           on-cancel cancel)))))))
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
             footer)))))

     ;; and now, render the main component
     (defun render ()
       (chain *react (render
                      (panic:jsl
                       ((chain *react (create-factory *todo-app)) (create model model)))
                      (chain document (get-elements-by-class-name "todoapp") 0))))
     (chain model (subscribe render))
     (render))))
