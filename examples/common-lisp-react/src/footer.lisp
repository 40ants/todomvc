(quickload "panic")

(defvar app (or app (create)))

((lambda ()
   (panic:defclass *todo-footer (count
                                 completed-count
                                 now-showing
                                 on-clear-completed)
     (defun render ()
       (let ((active-todo-word (app.utils.pluralize count "item"))
             (clear-button (when (> completed-count 0)
                             (panic:jsl
                              (:button :class-name "clear-completed"
                                       :on-click on-clear-completed
                                       "Clear completed")))))
    
         (panic:jsl (:footer :class-name "footer"
                             (:span :class-name "todo-count"
                                    (:strong count)
                                    " "
                                    active-todo-word)
                             (:ul :class-name "filters"
                                  (:li
                                   (:a :href "#/"
                                       :class-name
                                       (class-names (create selected
                                                            (= now-showing (aref app "ALL_TODOS"))))
                                       "All"))
                                  (:li
                                   (:a :href "#/active"
                                       :class-name
                                       (class-names (create selected
                                                            (= now-showing (aref app "ACTIVE_TODOS"))))
                                       "Active"))
                                  (:li
                                   (:a :href "#/completed"
                                       :class-name
                                       (class-names (create selected
                                                            (= now-showing "COMPLETED_TODOS")))
                                       "Completed"))
                                  )
                             clear-button)))))

   (setf (aref app "TodoFooter")
         *todo-footer)))
