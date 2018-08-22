(function ($) {
    $(document).ready(function () {
        var taskList = $('#tasksList');
        var leadTaskTablePanel = $('#leadTaskTablePanel');
        var modal = $('#modalEditTask');
        var leadDetailActivities = $('#leadDetailActivities');
        var tasksDashList = $('.tasksDashList');

        if (tasksDashList.length){
            tasksDashList.on('click', '.timeline-edit-task', function () {
                modal.addClass('editingTask');
            });
        }
        if (leadDetailActivities.length){
            leadDetailActivities.on('click', '.timeline-edit-task', function () {
                modal.addClass('editingTask');
            });
        }
        if (taskList.length){
            taskList.on('click', '.task-item .task-edit', function () {
                modal.addClass('editingTask');
            });
        }

        if (leadTaskTablePanel.length){
            leadTaskTablePanel.on('click', '.leadTaskEditBtn', function () {
                modal.addClass('editingTask');
            });
        }

        if (modal.length > 0) {
            //flog('Init modalEditTask');
            $(document.body).on('hidden.bs.modal', '#modalEditTask', function () {
                modal.removeClass('editingTask');
            });
            $(document.body).on('loaded.bs.modal shown.bs.modal', '#modalEditTask', function () {
                flog('Modal Loaded');
                // $(".completeTaskDiv").show(300);

                var modal = $(this);
                var notes = modal.find('.lead-notes');
                var selectpicker = modal.find('.selectpicker');
                selectpicker.selectpicker({
                    maxOptions: 5
                });
                notes.dotdotdot({
                    height: 200,
                    callback: function (isTruncated, orgContent) {
                        if (isTruncated) {
                            var currentContent = notes.html();
                            notes.html('<div class="lead-notes-inner">' + currentContent + '</div>');
                            var notesInner = notes.find('.lead-notes-inner');
                            var toggler = $('<a href="#" class="text-info">View more <i class="fa fa-angle-double-down"></i></a>');
                            notes.append(toggler);

                            toggler.click(function (e) {
                                e.preventDefault();

                                if (toggler.hasClass('opened')) {
                                    notesInner.html(currentContent);
                                    toggler.html('View more <i class="fa fa-angle-double-down"></i>');
                                    toggler.removeClass('opened');
                                } else {
                                    notesInner.html(orgContent);
                                    toggler.html('Hide <i class="fa fa-angle-double-up"></i>');
                                    toggler.addClass('opened');
                                }
                            });
                        }
                    }
                });

            });
        }
    });

})(jQuery);
