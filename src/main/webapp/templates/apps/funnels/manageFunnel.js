function initManageFunnel() {
    flog('initManageFunnel');

    initTabLead();
    initPropertiesTab();
    $('.timeago').timeago();
}

function initTabLead() {
    flog('initTabLead');

    $(document.body).on('click', '.btn-del-lead', function (e) {
        e.preventDefault();

        var btn = $(this);
        var tr = btn.closest('tr');
        var leadId = btn.data('leadid');
        confirmDelete(leadId, 'this lead', function () {
            tr.remove();
        });
    });
}

function initPropertiesTab() {
    flog('initPropertiesTab');

    initPropertiesList();
    initPropertiesForm();
}

function initPropertiesList() {
    flog('initPropertiesList');

    var list = ['source', 'stage', 'lostReason', 'customerActivity', 'funnelTester', 'extraField'];

    $.each(list, function (i, item) {
        var btnAdd = $('.btn-add-' + item);
        var wrapper = $('.' + item + '-wrapper');
        var template = $('#template-' + item).html();

        btnAdd.on('click', function (e) {
            e.preventDefault();

            var temp = $(template);
            if (item === 'customerActivity') {
                temp.find('[name=customerActivityId]').val('customActivity' + (new Date()).getTime());
            }

            wrapper.append(temp);
        });

        $(document.body).on('click', '.btn-remove-' + item, function (e) {
            e.preventDefault();

            $(this).closest('.' + item).remove();
        });
    });
}

function initPropertiesForm() {
    flog('initPropertiesForm');

    var form = $('.form-properties');
    form.forms({
        allowPostForm: false,
        onValid: function () {
            var sources = [];
            $('.source-wrapper').find('.source').each(function () {
                var source = $(this).find('[name=sources]').val().trim();

                sources.push(source);
            });

            var stages = [];
            $('.stage-wrapper').find('.stage').each(function () {
                var stage = $(this);

                stages.push({
                    name: stage.find('[name=stageName]').val().trim(),
                    desc: stage.find('[name=stageDesc]').val().trim()
                });
            });

            var extraFields = [];
            $('.extraField-wrapper').find('.extraField').each(function () {
                var extraField = $(this);

                extraFields.push({
                    name: extraField.find('[name=extraFieldName]').val().trim(),
                    title: extraField.find('[name=extraFieldTitle]').val().trim(),
                    required: extraField.find('[name=extraFieldRequired]').is(':checked'),
                    aggregate: extraField.find('[name=extraFieldAggregate]').is(':checked')
                });
            });

            var lostReasons = [];
            $('.lostReason-wrapper').find('.lostReason').each(function () {
                var lostReason = $(this).find('[name=lostReason]').val().trim();

                lostReasons.push(lostReason);
            });

            var customerActivities = [];
            $('.customerActivity-wrapper').find('.customerActivity').each(function () {
                var customerActivity = $(this);

                customerActivities.push({
                    id: customerActivity.find('[name=customerActivityId]').val().trim(),
                    text: customerActivity.find('[name=customerActivityText]').val().trim(),
                    inbound: customerActivity.find('[name=customerActivityInbound]').val() === 'true'
                });
            });

            var funnelTesters = [];
            $('.funnelTester-wrapper').find('.funnelTester').each(function () {
                var funnelTester = $(this);

                funnelTesters.push({
                    emailDomain: funnelTester.find('[name=funnelTesterEmailDomain]').val().trim(),
                    delayMins: +funnelTester.find('[name=funnelTesterDelay]').val().trim(),
                    accelerator: +funnelTester.find('[name=funnelTesterAcce]').val().trim()
                });
            });

            JBApp.funnel.title = form.find('[name=title]').val().trim();
            JBApp.funnel.leadsGroup = form.find('[name=leadsGroup]').val();
            JBApp.funnel.sources = sources;
            JBApp.funnel.stages = stages;
            JBApp.funnel.extraFields = extraFields;
            JBApp.funnel.lostReasons = lostReasons;
            JBApp.funnel.customerActivities = customerActivities;
            JBApp.funnel.funnelTesters = funnelTesters;

            saveFunnel('', function () {
                Msg.success('Properties are saved!');
            });
        }
    });
}
