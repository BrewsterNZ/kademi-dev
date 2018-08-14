/**
 * Show journal feature for your website
 *
 * jquery.journal.js
 * @author: brad & duc
 * @version: 1.0.0
 */

(function ($) {
    $.fn.journal = function (options) {
        var container = this;
        var config = $.extend({
            journalBaseUrl: userUrl + 'journal',
            journalName: getFileName(getFolderPath(window.location.pathname)),
            journalItem: getFileName(window.location.pathname)
        }, options);
        
        var journalDiv = container.find('.journal');
        
        if (journalDiv.length === 0) {
            journalDiv = $(
                '<div class="journal">' +
                '    <button class="journal-show btn btn-lg btn-default"><i class="fa fa-sticky-note-o"></i></button>' +
                '    <div class="journal-inner">' +
                '        <div class="journal-title">' +
                '             <h4>' +
                '                 <a class="journal-close">&times;</a>' +
                '                 <i class="fa fa-sticky-note-o fa-fw journal-icon"></i> ' +
                '                 <i class="fa fa-spinner fa-pulse fa-fw ajax-loader" class="ajax-loader"></i> ' +
                '                 Journal' +
                '             </h4>' +
                '             <p class="small">Just jot down whatever notes you want to keep, these will be saved automatically in a separated box for each page.</p>' +
                '        </div>' +
                '        <div class="journal-notes"></div>' +
                '    </div>' +
                '</div>'
            );
            container.append(journalDiv);
        }
        
        var journalNotes = journalDiv.find('.journal-notes');
        journalNotes.css('top', journalDiv.find('.journal-title').outerHeight());
        
        journalDiv.find('.journal-show').on('click', function (e) {
            e.preventDefault();
            
            journalDiv.addClass('active');
            
            if (!journalNotes.hasClass('loaded')) {
                showJournalNotes(journalDiv, journalNotes, config);
            }
        });
        
        journalDiv.find('.journal-close').on('click', function (e) {
            e.preventDefault();
            
            journalDiv.removeClass('active');
        });
        
        autoSaveJournals(container, config);
    };
    
    function showJournalNotes(journalDiv, journalNotes, config) {
        try {
            journalNotes.addClass('loaded').html('');
            journalDiv.addClass('ajax-processing');
            
            var baseUrl = config.journalBaseUrl + '/' + config.journalName;
            var url = baseUrl + '/_DAV/PROPFIND?fields=name,milton:textContent&depth=1';
            
            var thisPage = getFileName(window.location.pathname) || 'index.html';
            flog('[jquery.journal] thisPage', thisPage);
            var current = addJournalEntry(journalNotes, thisPage);
            
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'json',
                success: function (resp) {
                    try {
                        flog('[jquery.journal] Got journals', resp.length);
                        
                        for (var i = 1; i < resp.length; i++) {
                            var r = resp[i];
                            if (!r.name.startsWith('.') && r.name.length > 0) {
                                var textarea = addJournalEntry(journalNotes, r.name);
                                textarea.val(r.textContent);
                                flog('[jquery.journal] r', r, textarea, r.textContent);
                            }
                        }
                        
                        flog('[jquery.journal] Set focus', current);
                        current.focus();
                    } catch (e) {
                        flog('[jquery.journal] Error in showing journal entries', e);
                    }
                },
                error: function (resp) {
                    if (resp.status === 404) {
                        flog('[jquery.journal] No journal, create it', config);
                        
                        var parentPath = getFolderPath(config.journalBaseUrl);
                        var baseName = getFileName(config.journalBaseUrl);
                        createFolder(baseName, parentPath, function () {
                            createFolder(config.journalName, config.journalBaseUrl);
                        });
                        current.focus();
                    } else {
                        flog('[jquery.journal] Failed to get journal', resp);
                        alert('Sorry, we could not load journal entries');
                    }
                },
                complete: function () {
                    journalDiv.removeClass('ajax-processing');
                }
            });
        } catch (e) {
            flog('[jquery.journal] Error when showing journal notes', e);
            journalDiv.removeClass('ajax-processing');
        }
    }
    
    function autoSaveJournals(container, config) {
        flog('[jquery.journal] autoSaveJournals', config);
        
        sortJournalEntries(container);
        
        container.on('keyup', '.journal-entry textarea', function (e) {
            typewatch(function () {
                flog('[jquery.journal] Do save', config);
                try {
                    saveJournal($(e.target), config);
                } catch (e) {
                    flog('[jquery.journal] exception doing save', e);
                }
            }, 500);
        });
        
        container.on('focus', '.journal-entry textarea', function (e) {
            flog('[jquery.journal] focus', e.target);
            container.find('textarea').parent().removeClass('active');
            $(e.target).parent().addClass('active');
        });
        
        $(document).on('pjaxComplete', function () {
            try {
                var textareas = container.find('.journal-entry textarea');
                textareas.parent().removeClass('active');
                var thisPage = getFileName(window.location.pathname);
                var newSelected = textareas.parent().find('[name="' + thisPage + '"]').parent();
                if (newSelected.length === 0) {
                    var newTextArea = addJournalEntry(container, thisPage);
                    sortJournalEntries(container);
                    newSelected = newTextArea.closest('.journal-entry');
                }
                newSelected.addClass('active');
            } catch (e) {
                flog('[jquery.journal] Exception in pjaxComplete', e);
            }
        });
    }
    
    /**
     * Add a new journal entry, or locate an existing one with the given name
     *
     * @param {div} container
     * @param {string} name
     * @returns {textarea}
     */
    function addJournalEntry(container, name) {
        flog('[jquery.journal] addJournalEntry', name);
        
        var textarea = container.find('textarea[name="' + name + '"]');
        if (textarea.length === 0) {
            container.append(
                '<div class="journal-entry">' +
                '    <a href="/' + name + '">' + name + '</a>' +
                '    <textarea class="form-control" row="2" name="' + name + '"></textarea>' +
                '</div>'
            );
            
            var textarea = container.find('textarea[name="' + name + '"]');
            window.setTimeout(function () {
                textarea.height(textarea[0].scrollHeight);
            }, 1);
        }
        
        return textarea;
    }
    
    function saveJournal(textarea, config) {
        var notes = textarea.val();
        var url = config.journalBaseUrl + "/" + config.journalName + "/_DAV/PUT";
        
        flog('[jquery.journal] saveJournal', textarea, config, notes, url);
        
        var pageName = textarea.attr('name');
        var journalDiv = textarea.closest('.journal');
        journalDiv.addClass('ajax-processing');
        
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                content: notes,
                name: pageName,
                overwrite: 'true'
            },
            dataType: 'json',
            success: function (resp) {
                flog('[jquery.journal] saveJournal succeed', resp);
            },
            error: function (resp) {
                if (resp.status === 404) {
                    flog('[jquery.journal] No journal', resp);
                    
                    div.append(
                        '<div class="journal-entry">' +
                        '    <a href="' + name + '">' + name + '</a>' +
                        '    <textarea class="form-control" row="2" name="' + name + '"></textarea>' +
                        '</div>'
                    );
                } else {
                    flog('[jquery.journal] Failed to get journal', resp);
                    alert('Sorry, we could not load journal entries');
                }
            },
            complete: function () {
                journalDiv.removeClass('ajax-processing');
            }
        });
    }
    
    function sortJournalEntries(container) {
        var arr = $('.journal-entry').sort(function (a, b) {
            var t1 = $(a).find('textarea');
            var t2 = $(b).find('textarea');
            return t1.attr('name') > t2.attr('name') ? 1 : -1;
        });
        
        container.find('.journal-notes').html(arr);
    }
    
    $(function () {
        $(document.body).journal();
    });
    
})(jQuery);
