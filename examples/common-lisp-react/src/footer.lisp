(quickload "panic")

(defvar app (or app (create)))

((lambda ()
   (panic:defcomponent *todo-footer
       ()
     (let ((active-todo-word (app.utils.pluralize
                              (@ this props count)
                              "item"))
           (clear-button (when (> (@ this props completed-count)
                                  0)
                           (panic:jsl
                            (:button :class-name "clear-completed"
                                     :on-click (@ this props on-clear-completed)
                                     "Clear completed"))))
           (now-showing (@ this props now-showing)))
    
       (panic:jsl (:footer :class-name "footer"
                           (:span :class-name "todo-count"
                                  (:strong (@ this props count))
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
                           clear-button))))

   (setf (aref app "TodoFooter")
         *todo-footer)))
