(defvar app (or app (create)))

;; Generic "model" object. You can use whatever
;; framework you want. For this application it
;; may not even be worth separating this logic
;; out, but we do this to demonstrate one way to
;; separate out parts of your application.

((lambda ()
   (setf
    (@ app "TodoModel")
    (lambda (key)
      (setf (@ this key) key
            (@ this todos) (chain app utils (store key))
            (@ this on-changes) '())
      this)

    (@ app "TodoModel" prototype subscribe)
    (lambda (on-change)
      (chain this on-changes (push on-change)))

    (@ app "TodoModel" prototype inform)
    (lambda ()
      (chain app utils (store (@ this key)
                              (@ this todos)))
      (chain this on-changes
             (for-each (lambda (cb) (cb)))))

    (@ app "TodoModel" prototype add-todo)
    (lambda (title)
      (setf (@ this todos)
            (chain this
                   todos
                   (concat
                    (create id (chain app utils (uuid))
                            title title
                            completed false))))
      (chain this (inform)))

    (@ app "TodoModel" prototype toggle-all)
    (lambda (checked)
      (setf (@ this todos)
            (chain this todos
                   (map (lambda (todo)
                          (chain app utils (extend
                                            todo
                                            (create completed checked)))))))
      (chain this (inform)))

    (@ app "TodoModel" prototype toggle)
    (lambda (todo-to-toggle)
      (setf (@ this todos)
            (chain this todos
                   (map (lambda (todo)
                          (if (eq todo todo-to-toggle)
                              (chain app utils (extend
                                                todo
                                                (create completed (not (@ todo completed)))))
                              todo)))))
      (chain this (inform)))

    (@ app "TodoModel" prototype destroy)
    (lambda (todo)
      (setf (@ this todos)
              (chain this todos (filter (lambda (candidate)
                                          (not (eq candidate todo))))))
      (chain this (inform)))

    (@ app "TodoModel" prototype save)
    (lambda (todo-to-save text)
      (setf (@ this todos)
            (chain this todos (map (lambda (todo)
                                     (if (eq todo todo-to-save)
                                         (chain app utils (extend
                                                           todo
                                                           (create title text)))
                                         todo)))))
      (chain this (inform)))

    (@ app "TodoModel" prototype clear-completed)
    (lambda ()
      (setf (@ this todos)
            (chain this todos (filter
                               (lambda (todo)
                                 (not (@ todo completed))))))
      (chain this (inform))))))
