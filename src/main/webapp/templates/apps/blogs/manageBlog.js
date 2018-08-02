function initManageBlogs() {
    initCRUDBlog();
    initCRUDArticle();
    var blogContainer = $('#blogs-container');
    initDuplicate(blogContainer);
}


function initManageBlog() {
    initManageBlogForms();
    var blogContainer = $('#blogs-container');
    initDuplicate(blogContainer);
}

function initManageBlogForms() {
    $('#addArticleModal form').forms({
        onSuccess: function (resp) {
            if (resp.status) {
                flog('created  blog', resp);
                window.location = resp.nextHref;
            } else {
                Msg.error('Sorry, there was a problem creating the article');
            }

        }
    });
    $('#addTagModal form').forms({
        onSuccess: function (resp) {
            if (resp.status) {
                $('#tags-container').reloadFragment();
                $('#addTagModal').modal('hide');
            } else {
                Msg.error('Sorry, there was a problem creating the article');
            }

        }
    });

    $('#addCategoryModal form').forms({
        onSuccess: function (resp) {
            if (resp.status) {
                $('#categories-container').reloadFragment();
                $('#addCategoryModal').modal('hide');
            } else {
                Msg.error('Sorry, there was a problem creating the article');
            }
        }
    });

    $('body').on('click', 'a.delete-article', function (e) {
        e.preventDefault();
        var link = $(e.target).closest('a');
        var href = link.attr('href');
        confirmDelete(href, href, function () {
            link.closest('tr').remove();
        });
    });

    $('body').on('click', 'a.tag-delete', function (e) {
        e.preventDefault();
        var link = $(e.target).closest('a');
        var href = link.attr('href');
        if (confirm('Are you sure you want to delete ' + href)) {
            $.ajax({
                type: 'POST',
                url: window.location.pathname,
                data: {
                    removeTagName: href
                },
                dataType: 'json',
                success: function (resp) {
                    $('#tags-container').reloadFragment();
                    Msg.info('Deleted tag');
                },
                error: function (resp, textStatus, errorThrown) {
                    alert('An error occured deleting the tag')
                }
            });

        }
    });

    $('body').on('click', 'a.tag-edit', function (e) {
        e.preventDefault();
        var link = $(e.target).closest('a');
        var href = link.attr('href');
        var newTag = prompt('Please enter a new name for ' + href);
        if (newTag) {
            $.ajax({
                type: 'POST',
                url: window.location.pathname,
                data: {
                    editTagName: href,
                    updatedTagName: newTag
                },
                dataType: 'json',
                success: function (resp) {
                    $('#tags-container').reloadFragment();
                    Msg.info('Updated tag');
                },
                error: function (resp, textStatus, errorThrown) {
                    alert('An error occured updating the tag')
                }
            });
        }
    });

    $('body').on('click', 'a.cat-delete', function (e) {
        e.preventDefault();
        var link = $(e.target).closest('a');
        var href = link.attr('href');
        if (confirm('Are you sure you want to delete ' + href)) {
            $.ajax({
                type: 'POST',
                url: window.location.pathname,
                data: {
                    removeCategoryName: href
                },
                dataType: 'json',
                success: function (resp) {
                    $('#categories-container').reloadFragment();
                    Msg.info('Deleted category');
                },
                error: function (resp, textStatus, errorThrown) {
                    alert('An error occured deleting the category')
                }
            });

        }
    });

    $('body').on('click', 'a.cat-edit', function (e) {
        e.preventDefault();
        var link = $(e.target).closest('a');
        var href = link.attr('href');
        var newCat = prompt('Please enter a new name for ' + href);
        if (newCat) {
            $.ajax({
                type: 'POST',
                url: window.location.pathname,
                data: {
                    editCategoryName: href,
                    updatedCategoryName: newCat
                },
                dataType: 'json',
                success: function (resp) {
                    $('#categories-container').reloadFragment();
                    Msg.info('Updated category');
                },
                error: function (resp, textStatus, errorThrown) {
                    alert('An error occured updating the category')
                }
            });
        }
    });
}




function initDuplicate(blogContainer) {
    blogContainer.on('click', '.dup-article', function (e) {
        e.preventDefault();

        var href = $(this).attr('href');
        $.ajax({
            url: href,
            data: {
                duplicate: true
            },
            method: "POST",
            datatype: "json"
        }).done(function (data) {
            flog('Done', data);
            Msg.info('Duplicated article');
            window.location.reload();
        });

    });

}

function initCRUDBlog() {
    var blogContainer = $('#blogs-container');
    var modalAddBlog = $('#modal-blog');

    modalAddBlog.find('form').forms({
        onSuccess: function (resp) {
            flog('created  blog', resp);
            modalAddBlog.modal('hide');
            blogContainer.reloadFragment();
        }
    });


    blogContainer.on('click', '.btn-rename-group', function (e) {
        e.preventDefault();
        var btn = $(this);
        var name = btn.data('name');
        var href = $(e.target).closest('a').attr('href');


        promptRename(href, name, function () {
            blogContainer.reloadFragment();
        });
    });

    blogContainer.on('click', '.btn-delete-group', function (e) {
        e.preventDefault();
        var href = $(e.target).closest('a').attr('href');

        confirmDelete(href, getFileName(href), function () {
            blogContainer.reloadFragment();
        });
    });

    var copyBlogModal = $('#modal-copy-blog');
    blogContainer.on('click', '.btn-copy-blog', function (e) {
        e.preventDefault();

        var href = $(this).attr('href');

        copyBlogModal.find('form').attr('action', href);
        copyBlogModal.modal('show');
    });

    copyBlogModal.find('form').forms({
        onSuccess: function () {
            Msg.info('Copied blog');
            blogContainer.reloadFragment();
            copyBlogModal.modal('hide');
        }
    });
}

function promptRename(sourceHref, name, onSuccess) {
    log("promptRename", sourceHref);
    var currentName = getFileName(sourceHref);
    var newName = prompt("Please enter a new name for " + name, name);
    if (newName) {
        newName = newName.trim();
        if (newName.length > 0 && currentName != newName) {
            var currentFolder = getFolderPath(sourceHref);
            var dest = currentFolder;
            if (!dest.endsWith("/")) {
                dest += "/";
            }
            dest += newName;
            move(sourceHref, dest, onSuccess);
        }
    }
}

function initCRUDArticle() {
    var newArticleModal = $('#modal-new-article');
    var blogContainer = $('#blogs-container');

    blogContainer.on('click', '.btn-new-article', function (e) {
        e.preventDefault();

        var href = $(this).attr('href');

        flog('Show new article modal', href, newArticleModal);
        newArticleModal.find('form').attr('action', href);
        newArticleModal.modal('show');
    });

    newArticleModal.find('form').forms({
        onSuccess: function (resp) {
            flog('done', resp);
            newArticleModal.modal('hide');
            Msg.info('Created article, now redirecting to the edit page');
            window.location = resp.nextHref;
        }
    });

    blogContainer.on('click', 'a.btn-delete-article', function (e) {
        e.preventDefault();

        var link = $(this);
        var href = link.attr('href');

        confirmDelete(href, href, function () {
            link.closest('tr').remove();
        });
    });
}