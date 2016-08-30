(defvar app (or app (create)))

((lambda ()
   (defun random-byte ()
     (round (random 16)))


   (defun uuid ()
     (let ((uuid ""))
       (dotimes (i 32)
         (let ((random (random-byte)))
           (when (or (= i 8)
                     (= i 12)
                     (= i 16)
                     (= i 20))
             (setf uuid (+ uuid "-")))
          
           (setf uuid (+ uuid
                         (chain
                          (case i
                            (12 4)
                            (16 (logior (logand random 3)
                                        8))
                            (otherwise random))

                          (to-string 16))))))
       uuid))


   (defun pluralize (count word)
     (if (= count 1)
         word
         (+ word "s")))


   (defun store (namespace data)
     (if data
         (let ((data-string (chain
                             *j-s-o-n
                             (stringify data))))
           (chain local-storage
                  (set-item namespace data-string)))
         ;; no data, getting from local storage
         (let ((store (chain local-storage (get-item namespace))))
           (or (and store
                    (chain *j-s-o-n (parse store)))
               '()))))


   (defun extend ()
     (let ((new-obj (create)))
       (dolist (obj arguments)
         (for-in (key obj)
                 (setf (aref new-obj key)
                       (aref obj key))))
       new-obj))


   (setf (aref app "Utils")
         (create
          uuid uuid
          pluralize pluralize
          store store
          extend extend))

   (setf (aref app "utils")
         (aref app "Utils"))))
