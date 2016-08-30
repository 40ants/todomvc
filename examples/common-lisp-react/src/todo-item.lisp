(quickload "panic")

(defvar app (or app (create)))


((lambda ()
   (defvar +escape-key+ 27)
   (defvar +enter-key+ 13)

   (panic:defcomponent *todo-item
       (handle-submit
        (lambda (event)
          (let ((val (chain this state edit-text (trim))))
            (if val
                (progn
                  (chain this props (on-save val))
                  (chain this (set-state (create edit-text val))))
                (chain this props (on-destroy)))))
       
        handle-edit
        (lambda ()
          (chain this props (on-edit))
          (chain this (set-state (create edit-text (@ this props todo title)))))
       
        handle-key-down
        (lambda (event)
          (when (= event.which +escape-key+)
            (chain this (set-state (create edit-text
                                           (@ this props todo title))))
            (chain this props (on-cancel event)))
          (when (= event.which +enter-key+)
            (chain this (handle-submit event))))

        handle-change
        (lambda (event)
          (when this.props.editing
            (chain this (set-state (create edit-text event.target.value)))))

        get-initial-state
        (lambda ()
          (create edit-text (@ this props todo title)))

        should-component-update
        (lambda (next-props next-state)
          (or (not (eq (@ next-props todo)
                       (@ this props todo)))
              (not (eq (@ next-props editing)
                       (@ this props editing)))
              (not (eq (@ next-state edit-text)
                       (@ this state edit-text)))))

        component-did-update
        (lambda (prev-props)
          (when (and (not (@ prev-props editing))
                     (@ this props editing))
            (let* ((node (chain *react (find-d-o-m-node
                                        (@ this refs edit-field))))
                   (value-length (@ node value length)))
             
              (chain node (focus))
              (chain node (set-selection-range value-length
                                               value-length))))))
     (panic:jsl
      (:li :class-name (class-names
                        (create completed (@ this.props.todo.completed)
                                editing (@ this.props.editing)))
           (:div :class-name "view"
                 (:input :class-name "toggle"
                         :type "checkbox"
                         :checked (@ this props todo completed)
                         :on-change (@ this props on-toggle))
                 (:label :on-double-click (@ this handle-edit)
                         (@ this props todo title))
                 (:button :class-name "destroy"
                          :on-click (@ this props on-destroy)))
           (:input :ref "editField"
                   :class-name "edit"
                   :value (@ this state edit-text)
                   :on-blur (@ this handle-submit)
                   :on-change (@ this handle-change)
                   :on-key-down (@ this handle-key-down))))
     )


   (setf (aref app "TodoItem")
         *todo-item)
   ))
