$(function () {
    var QUESTION_TYPES = ['Multiple Choices', 'Plain Text', 'Yes/No question', 'Single Choice'];
    var modalQuestion = $('#modal-question');
    var modalSurvey = $('#modal-survey');
    
    modalQuestion.find('.btn-popup-save').on('click', function (e) {
        e.preventDefault();
        modalQuestion.find('form button[type=submit]').trigger('click');
    });
    modalSurvey.find('.btn-popup-save').on('click', function (e) {
        e.preventDefault();
        modalSurvey.find('form button[type=submit]').trigger('click');
    });
    
    initHtmlEditors(modalQuestion.find('.htmleditor'), getStandardEditorHeight(), null, null, standardRemovePlugins + ',autogrow', function (editor) {
        editor.config.pagePath = window.location.pathname;
    });
    
    $('.btn-add-survey').on('click', function (e) {
        e.preventDefault();
        modalSurvey.find('form').trigger('reset');
        modalSurvey.find('form input[type=hidden].available-datetime').val('');
        modalSurvey.modal('show');
    });
    
    $(document).on('click', '.btn-add-question', function (e) {
        e.preventDefault();
        var modalQuestion = $('#modal-question');
        modalQuestion.find('[name=questionType]').trigger('change');
        modalQuestion.find('form').trigger('reset');
        modalQuestion.find('[name=questionType]').removeAttr('disabled');
        modalQuestion.find('iframe').contents().find('body').empty();
        modalQuestion.modal('show');
    });
    
    $(document).on('change', '[name=questionType]', function () {
        if (this.value === '3') {
            $('.answerLayout').removeClass('hide');
        } else {
            $('.answerLayout').addClass('hide');
        }
    });
    
    $(document).on('click', '.btn-edit-question', function (e) {
        e.preventDefault();
        var questionId = $(this).parents('.panel').attr('data-question-id');
        
        modalQuestion.modal('show');
        
        $.ajax({
            url: '/ksurvey/question/',
            type: 'get',
            data: {questionId: questionId, getQuestion: 'getQuestion'},
            dataType: 'json',
            success: function (resp) {
                if (resp && resp.status) {
                    if (resp.data.status) {
                        var question = resp.data.data;
                        var modalQuestion = $('#modal-question');
                        
                        modalQuestion.find('[name=questionId]').val(question.questionId);
                        modalQuestion.find('[name=surveyId]').val(question.surveyId);
                        modalQuestion.find('[name=createdBy]').val(question.createdBy);
                        modalQuestion.find('[name=questionTitle]').val(question.title);
                        modalQuestion.find('[name=questionType]').val(question.type).attr('disabled', 'disabled');
                        modalQuestion.find('[name=questionBody]').val(question.body);
                        modalQuestion.find('[name=answerLayout]').val(question.answerLayout);
                        modalQuestion.find('[name=required]').prop('checked', question.required == "true");
                        if (question.type == "3") {
                            modalQuestion.find('.answerLayout').removeClass('hide');
                        } else {
                            modalQuestion.find('.answerLayout').addClass('hide');
                        }
                        
                    } else {
                        alert(resp.messages.join('\n'));
                    }
                } else {
                    alert(resp.messages.join('\n'));
                }
            }
        });
    });
    
    $(document).on('click', '.btn-delete-question', function (e) {
        e.preventDefault();
        
        var questionId = $(this).parents('.panel').attr('data-question-id');
        var c = confirm('Are you sure to delete this question?');
        if (c) {
            $.ajax({
                url: '/ksurvey/question/',
                type: 'get',
                data: {
                    questionId: questionId,
                    deleteQuestion: 'deleteQuestion'
                },
                dataType: 'json',
                success: function (resp) {
                    if (resp && resp.status && resp.data.status) {
                        $('#questions-list').find('.panel[data-question-id="' + questionId + '"]').remove();
                        Msg.info('Question was deleted', 1000);
                    } else {
                        Msg.error(resp.messages.join('\n'));
                    }
                }
            });
        }
    });
    
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var currentTab = $(e.target).attr('href');
        var hash = window.location.hash;
        if (currentTab === '#statistic' && hash.indexOf('#statistic') !== -1 && window.browserStats && window.osStats) {
            Morris.Donut({
                element: 'browserStats',
                data: browserStats
            });
            Morris.Donut({
                element: 'osStats',
                data: osStats
            });
            if (window.histogramChart) {
                window.histogramChart.update();
            }
        }
    }).trigger('shown.bs.tab');
    
    $(document).on('click', '.btn-delete-survey', function (e) {
        e.preventDefault();
        
        var surveyId = $(this).attr('data-id');
        var c = confirm('Are you sure to delete this survey?');
        if (c) {
            $.ajax({
                url: '/ksurvey/',
                type: 'post',
                data: {
                    surveyId: surveyId,
                    deleteSurvey: 'deleteSurvey'
                },
                dataType: 'json',
                success: function (resp) {
                    if (resp && resp.status && resp.data.status) {
                        $('#survey-list').find('tr[data-id="' + surveyId + '"]').remove();
                        Msg.info('Survey was deleted');
                    } else {
                        Msg.error(resp.messages.join('\n'));
                    }
                }
            });
        }
    });
    
    $(document).on('submit', '.answer-form', function (e) {
        e.preventDefault();
        var form = $(this);
        var data = form.serialize();
        var answerId = form.find('[name=answerId]');
        var oldAnswer;
        if (answerId.length) {
            // update answer
            var liParent = form.parent();
            oldAnswer = liParent.find('span').text();
            liParent.find('span').text(form.find('[name=answerBody]').val()).removeClass('hide');
            liParent.find('.btn-edit-answer, .btn-delete-answer').removeClass('hide');
            form.addClass('hide');
        } else {
            var list = form.siblings('.list-group');
            list.append('<li class="list-group-item answer-item"><span>' + form.find('[name=answerBody]').val() + '</span><a class="btn btn-link btn-sm btn-reorder-answer pull-right" href="#" title="Re-order answer"><i class="fa fa-sort"></i></a><a href="#" class="btn btn-sm pull-right btn-delete-answer"><i class="fa fa-trash"></i></a> <a href="#" class="btn btn-sm pull-right btn-edit-answer"><i class="fa fa-edit"></i></a></li>');
            form.find('[name=answerBody]').attr('readonly', 'readonly').val('');
        }
        $.ajax({
            url: '/ksurvey/answer/?saveAnswer=saveAnswer',
            type: 'post',
            data: data,
            dataType: 'json',
            success: function (resp) {
                if (resp && resp.status) {
                    if (answerId.length) {
                        form.remove();
                    } else {
                        list.find('li:last-child').attr('data-answer', resp.data.data.answerId);
                        form.find('[name=answerBody]').removeAttr('readonly');
                    }
                    $('#stats-questions').reloadFragment({
                        whenComplete: function () {
                            initProgressBar();
                            var answersList = form.siblings('.answersList');
                            if (answersList.data('ui-sortable')) {
                                answersList.sortable("refresh");
                            }
                        }
                    });
                } else {
                    alert(resp.messages.join('\n'));
                    if (answerId.length) {
                        form.siblings('span').text(oldAnswer);
                        form.remove();
                    } else {
                        list.find('li:last-child').remove();
                    }
                }
            }
        });
    });
    
    $(document).on('click', '.btn-delete-answer', function (e) {
        e.preventDefault();
        var list = $(this).parents('.list-group');
        var answerId = $(this).parent().attr('data-answer');
        var c = confirm('Are you sure to delete this answer?');
        if (c) {
            $.ajax({
                url: '/ksurvey/answer/',
                type: 'get',
                data: {
                    answerId: answerId,
                    deleteAnswer: 'deleteAnswer'
                },
                dataType: 'json',
                success: function (resp) {
                    if (resp && resp.status) {
                        list.find('li[data-answer=' + answerId + ']').remove();
                        $('#stats-questions').reloadFragment({
                            whenComplete: function () {
                                initProgressBar()
                            }
                        });
                    } else {
                        alert(resp.messages.join('\n'));
                    }
                }
            });
        }
    });
    
    $(document).on('click', '.btn-edit-answer', function (e) {
        e.preventDefault();
        var span = $(this).siblings('span').addClass('hide');
        $(this).addClass('hide').siblings('.btn-delete-answer').addClass('hide');
        var answerId = $(this).parent().attr('data-answer');
        var form = $(this).parents('.list-group').siblings('.answer-form').clone();
        form.find('[name=answerBody]').val(span.text());
        form.append('<input type="hidden" name="answerId" value="' + answerId + '" />');
        form.removeClass('hide');
        form.insertBefore(span);
    });
    
    $('#survey-form').on('submit', function (e) {
        e.preventDefault();
        var form = $(this);
        saveSurvey(form);
    });
    
    $('#modal-question').find('form').on('submit', function (e) {
        e.preventDefault();
        
        var form = $(this);
        
        var modalQuestion = $('#modal-question');
        var data = form.serialize();
        if (modalQuestion.find('[name=questionId]').val()) {
            data += '&questionType=' + modalQuestion.find('[name=questionType]').val();
        }
        var questionId = form.find('[name=questionId]').val();
        
        $.ajax({
            url: '/ksurvey/question/',
            type: 'post',
            data: data,
            dataType: 'json',
            success: function (resp) {
                if (resp && resp.status && resp.data.status) {
                    var returnObj = resp.data.data;
                    $('#questions-list').reloadFragment({
                        whenComplete: function () {
                            Msg.success('Question created/updated successfully');
                            modalQuestion.modal('hide');
                            $('html,body').animate({
                                scrollTop: $('#questions-list').find('[data-question-id="' + returnObj.questionId + '"]').offset().top - 50
                            }, 500);
                            form.trigger('reset');
                            $('#questions-list').sortable('refresh');
                        }
                    });
                    $('#stats-questions').reloadFragment({
                        whenComplete: function () {
                            initProgressBar();
                            initHistogram();
                        }
                    });
                } else {
                    Msg.error(resp.data.messages.join('<br />'));
                }
                
                form.find('[name=questionId]').val('');
            },
            error: function (e) {
                Msg.error('System error! Please contact your system administrator for support.');
                form.find('[name=questionId]').val('');
            }
        });
    });
    
    function saveSurvey(form) {
        // var valid = this.checkValidity();
        // if(!valid) return;
        var data = form.serialize();
        var surveyId = form.find('[name=surveyId]');
        $.ajax({
            url: window.location.pathname,
            type: 'post',
            data: data,
            dataType: 'json',
            success: function (resp) {
                if (resp && resp.status && resp.data.status) {
                    Msg.success('Survey updated successfully');
                    if (surveyId.length < 1) {
                        modalSurvey.modal('hide');
                        $("#survey-list").reloadFragment({
                            whenComplete: function () {
                                initTimeago();
                            }
                        });
                    } else {
                        $('#preview-area').reloadFragment();
                    }
                } else {
                    Msg.error(resp.data.messages.join('<br />'));
                }
            },
            error: function (e) {
                Msg.error('System error! Please contact your system administrator for support.');
            }
        });
    }
    
    function initGroupModal() {
        flog('initGroupModal');
        
        $(document).on('click', '#modal-groups input:checkbox', function (e) {
            var input = $(this);
            var isChecked = input.is(':checked');
            var name = input.attr('name');
            var surveyId = input.parents('.modal-body').attr('data-survey-id');
            $.ajax({
                url: '/ksurvey/saveGroupAccess/',
                data: {
                    group: name,
                    isAdd: isChecked,
                    surveyId: surveyId
                },
                type: 'POST',
                dataType: 'json',
                success: function (resp) {
                    if (resp && resp.status && resp.data.status) {
                        $('#group-list').reloadFragment();
                        // $('#modal-groups').reloadFragment();
                        Msg.success('Add/remove group is saved!');
                    } else {
                        flog('Error when adding/removing group', resp);
                        Msg.error('Error when adding/removing group. Please contact your system administrator for support.');
                        input.prop('checked', !isChecked);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    flog('Error when adding group', jqXHR, textStatus, errorThrown);
                    Msg.error('Error when adding/removing group. Please contact your system administrator for support.');
                    input.prop('checked', !isChecked);
                }
            });
        });
    }
    
    
    function initDateRange() {
        flog('initDateRange');
        
        var inputStartTime = $('[name=startTime');
        var inputEndTime = $('[name=endTime]');
        var inputPlaceholder = $('#availableFromTo');
        var startTime = inputStartTime.val();
        var endTime = inputEndTime.val();
        
        if (startTime && endTime) {
            startTime = moment(startTime).format('DD/MM/YYYY');
            endTime = moment(endTime).format('DD/MM/YYYY');
            
            inputPlaceholder.val(startTime + ' - ' + endTime);
        } else {
            inputPlaceholder.val('');
        }
        
        inputPlaceholder.daterangepicker({
            format: 'DD/MM/YYYY',
            ranges: {
                'In 7 Days': [moment(), moment().add(6, 'days')],
                'In 15 Days': [moment(), moment().add(14, 'days')],
                'In 30 Days': [moment(), moment().add(29, 'days')]
            },
            locale: {
                format: 'DD/MM/YYYY'
            }
        }, function (start, end) {
            flog('onChange', start, end);
            
            inputStartTime.val(start.toISOString());
            inputEndTime.val(end.toISOString());
        });
        
        inputPlaceholder.on('change', function (e) {
            var daterangepicker = inputPlaceholder.data('daterangepicker');
            
            var value = inputPlaceholder.val().trim();
            
            if (value) {
                //daterangepicker.notify();
            } else {
                inputStartTime.val('');
                inputEndTime.val('');
            }
        });
    }
    
    function initProgressBar() {
        $('.list-group .progress-bar').each(function () {
            $(this).css('width', this.getAttribute('aria-valuenow') + '%');
            if (this.getAttribute('aria-valuenow') < 1) {
                $(this).css('color', '#333');
                var div = $(this).children();
                div.detach().insertBefore($(this));
            }
        });
    }
    
    function initTimeago() {
        $('.timeago').timeago();
        $('.surveytime').each(function () {
            var txt = $(this).text();
            
            txt && $(this).text(moment(txt).format('DD/MM/YYYY hh:mm:ss'));
        })
    }
    
    function initHistogram() {
        if (!window.histogramData) return;
        nv.addGraph(function () {
            var chart = nv.models.multiBarChart()
                .showControls(false)
                .showLegend(false)
                .showYAxis(true)
                .showXAxis(true);
            
            if (!window.histogramChart) {
                window.histogramChart = chart;
            }
            chart.xAxis     //Chart x-axis settings
                .axisLabel('Date');
            
            chart.yAxis     //Chart y-axis settings
                .tickFormat(d3.format("d"))
                .axisLabel('Submissions');
            
            // chart.xAxis
            //     .tickFormat(function (d) {
            //         return d3.time.format('%x')(new Date(d))
            //     });
            
            var myData = [];
            var series = {
                values: [],
                key: "Submissions",
                color: "green"
            };
            myData.push(series);
            for (var i = 0; i < histogramData.length; i++) {
                var bucket = histogramData[i];
                series.values.push({x: moment(bucket.label).format('DD/MM/YYYY'), y: bucket.value});
            }
            
            
            flog("mydate", myData);
            
            d3.select('#histogram')    //Select the <svg> element you want to render the chart in.
                .datum(myData)         //Populate the <svg> element with chart data...
                .call(chart);          //Finally, render the chart!
            
            //Update the chart when window resizes.
            nv.utils.windowResize(function () {
                chart.update()
            });
            return chart;
        });
    }
    
    function initClearResult() {
        $(document).on('click', '.clearUserResult', function (e) {
            e.preventDefault();
            
            var userId = prompt('You are about to delete user result. Please enter userId to continue:');
            var surveyId = $(this).attr('data-survey-id');
            if (userId) {
                clearResult(surveyId, userId);
            } else {
                if (userId == null) {
                    // When press "Cancel"
                } else {
                    alert('Please enter username');
                }
            }
        });
        
        $(document).on('click', '.clearAllResult', function (e) {
            e.preventDefault();
            
            if (confirm('Are you sure you want to delete all result? This data will not be able to restore.')) {
                var surveyId = $(this).attr('data-survey-id');
                clearResult(surveyId);
            }
        });
    }
    
    function clearResult(surveyId, userId) {
        if (!userId) {
            userId = '';
        }
        $.ajax({
            url: '/ksurvey/clearResult/',
            type: 'post',
            data: {
                userId: userId,
                surveyId: surveyId
            },
            success: function (resp) {
                if (resp && resp.status) {
                    Msg.info('Result has been cleared');
                    $('#statistic').reloadFragment({
                        whenComplete: function () {
                            initProgressBar();
                            initHistogram();
                        }
                    });
                }
            },
            error: function (err) {
                Msg.error('Could not clear result. Please contact administrator for detail');
            }
        });
    }
    
    function initMigration() {
        $(document).on('click', '.btn-migration', function () {
            $('#modalMigration').modal();
        });
        $('#formMigrate').forms({
            onSuccess: function (resp) {
                if (resp.status) {
                    Msg.success("Migrated");
                    $('#modalMigration').modal('hide');
                }
            }
        })
    }
    
    function initSortableQuestions() {
        var questionsList = $('#questions-list');
        if (questionsList.length > 0) {
            flog('initSortableQuestions');
            
            questionsList.sortable({
                handle: '.btn-reorder-question',
                items: '> .panel-question',
                axis: 'y',
                tolerance: 'pointer',
                update: function () {
                    var questionsIds = [];
                    questionsList.find('.panel-question').each(function () {
                        questionsIds.push($(this).attr('data-question-id'));
                    });
                    questionsIds = questionsIds.join(',');
                    
                    flog('Reordered questions list IDs: ' + questionsIds);
                    
                    $.ajax({
                        url: '/ksurvey/question/',
                        type: 'get',
                        data: {
                            questionsIds: questionsIds,
                            reorderQuestions: 'reorderQuestions'
                        },
                        dataType: 'json',
                        success: function (resp) {
                            if (resp && resp.status && resp.data.status) {
                                Msg.info('Questions was re-ordered', 1000);
                            } else {
                                Msg.error(resp.messages.join('\n'));
                            }
                        }
                    });
                }
            });
        }
    }
    
    function initSortableAnswers() {
        var answersList = $('.answersList');
        if (answersList.length > 0) {
            flog('initSortableAnswers');
            
            answersList.each(function () {
                var list = $(this);
                list.sortable({
                    items: '> .answer-item',
                    handle: '.btn-reorder-answer',
                    axis: 'y',
                    tolerance: 'pointer',
                    containment: list,
                    update: function () {
                        var answersIds = [];
                        list.find('.answer-item').each(function () {
                            answersIds.push($(this).attr('data-answer'));
                        });
                        answersIds = answersIds.join(',');
                        
                        flog('Reordered questions list IDs: ' + answersIds);
                        
                        $.ajax({
                            url: '/ksurvey/question/',
                            type: 'get',
                            data: {
                                answersIds: answersIds,
                                reorderAnswers: 'reorderAnswers'
                            },
                            dataType: 'json',
                            success: function (resp) {
                                if (resp && resp.status && resp.data.status) {
                                    Msg.info('Answers was re-ordered', 1000);
                                } else {
                                    Msg.error(resp.messages.join('\n'));
                                }
                            }
                        });
                    }
                });
            })
        }
    }
    
    function initToggleQuestions() {
        $('.btn-toggle-questions').on('click', function (e) {
            e.preventDefault();
            $('#questions-list').find('.panel-question').each(function () {
                $(this).find('.panel-body').slideToggle();
            })
        })
    }
    
    function initYesNoAnswers() {
        $(document).on('change', '.yesnoAnswer', function (e) {
            var requiredQuestions = $(this).find(':selected').attr('data-requiredQuestions') || '';
            var panelBody = $(this).parents('.panel-body');
            panelBody.find('.requiredQuestion').each(function () {
                if (requiredQuestions.indexOf(this.value) != -1) {
                    this.checked = true;
                } else {
                    this.checked = false;
                }
            })
        });
        
        $(window).on('load', function () {
            $(document).find('.yesnoAnswer').trigger('change');
        });
        
        $(document).on('click', '.requiredQuestion', function (e) {
            var panelBody = $(this).parents('.panel-body');
            var qs = getRequiredQuestions(panelBody);
            var answerId = panelBody.find('.yesnoAnswer').val();
            $.ajax({
                url: '/ksurvey/answer/',
                type: 'post',
                data: {
                    requiredQuestions: qs,
                    answerId: answerId,
                    saveAnswerRequiredQuestions: 'saveAnswerRequiredQuestions'
                },
                dataType: 'json',
                success: function (resp) {
                    if (resp && resp.status) {
                        Msg.success('Saved');
                        panelBody.find('.yesnoAnswer').find(':selected').attr('data-requiredQuestions', qs);
                    } else {
                        Msg.error('Error');
                    }
                }
            })
        });
    }
    
    function getRequiredQuestions(panelBody) {
        var arr = [];
        panelBody.find('.requiredQuestion').each(function () {
            if (this.checked) {
                arr.push(this.value);
            }
        });
        return arr.join(',');
    }
    
    function initSurveyImageUpload() {
        flog('initSurveyImageUpload');
        $('.btn-survey-img-upload').each(function (i, item) {
            var btn = $(this);
            
            btn.upcropImage({
                buttonContinueText: 'Save',
                url: '/uploadSurveyImage/',
                fieldName: 'image',
                onCropComplete: function (resp) {
                    flog('onCropComplete:', resp, resp.nextHref);
                    $('#survey-image').val(resp.result.nextHref);   
                    $('.survey-image').show()
                    $('#img-survey').attr('src', resp.result.nextHref)
                },
                onContinue: function (resp) {
                    flog('onContinue:', resp, resp.result.nextHref);
                    $('#survey-image').val(resp.result.nextHref);
                    $('.survey-image').show()
                    $('#img-survey').attr('src', resp.result.nextHref)
                }
            });
        });
    }

    function initSurveyImageDelete() {
        $('body').on('click', '.btn-survey-img-del', function (e) {
            e.preventDefault();

            Kalert.confirm('You want to remove the survey image?', 'Ok', function () {
                $('#survey-image').val(null); 
                $('.survey-image').hide()
            });
        });
    }

    function reloadSurvey() {
        window.location.reload();
    }
    
    initGroupModal();
    initDateRange();
    initProgressBar();
    initTimeago();
    initHistogram();
    initClearResult();
    initMigration();
    initSortableQuestions();
    initSortableAnswers();
    initToggleQuestions();
    initYesNoAnswers();
    
    initSurveyImageUpload();
    initSurveyImageDelete();
    
});