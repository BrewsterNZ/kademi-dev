$(document).ready(function(){
    function initOrgTypeAhead() {
        var modal = $('.profile-add-membership');
        if (!modal.length) return;
        modal.on('shown.bs.modal', function () {
           var groupName = modal.find('[name=groupName]').val();
            var orgSearch = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                remote: {
                    url: '/'+groupName+'/signup?jsonQuery=%QUERY&th',
                    wildcard: '%QUERY'
                }
            });
            var orgTitleSearch = $('[name=orgTitleSearch]')
            orgTitleSearch.typeahead({
                highlight: true,
                cache: false
            }, {
                display: 'title',
                limit: 10,
                source: orgSearch,
                templates: {
                    empty: [
                        '<div class="empty-message">',
                        'No existing organisation were found.',
                        '</div>'
                    ].join('\n'),
                    suggestion: Handlebars.compile(
                        '<div>'
                        + '<strong>{{title}}</strong>'
                        + '</br>'
                        + '<span>{{phone}}</span>'
                        + '</br>'
                        + '<span>{{#if address}}{{address}}{{/if}} {{#if addressLine2}}{{#if address}},{{/if}}{{addressLine2}}{{/if}} {{#if addressState}}{{addressState}}{{/if}} {{#if postcode}}{{postcode}}{{/if}}</span>'
                        + '</div>')
                }
            });

            orgTitleSearch.bind('typeahead:select', function (ev, sug) {
                modal.find('input[name=orgId]').val(sug.orgId);
            });

            orgTitleSearch.attr('autocomplete', 'off');
        });
    }

    function initLeadContactAddresses() {
        var profileComAddressType = $('#profileComAddressType');
        if (!profileComAddressType.length) return;
        $(document).on('change', '#profileComAddressType', function () {
            var uri = new URI(window.location.href);
            uri.setSearch('addressType', this.value);
            history.pushState(null, null, uri.toString());
            $('#profileComponentAddressWrap').reloadFragment({
                url: uri.toString(),
                whenComplete: function () {
                    initProfileCountryList()
                }
            })
        });

        $('#profileAddressForm').forms({
            onSuccess: function (resp) {
                if (resp && resp.status){
                    Msg.success('Saved');
                }
            }
        })
    }

    function initProfileCountryList() {
        var countriesBH = new Bloodhound({
            datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.name); },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: getCountries() // From countries-state-lib
        });

        countriesBH.initialize();

        var profileAddressWrap = $('#profileComponentAddressWrap');
        if (!profileAddressWrap.length) return;
        profileAddressWrap.find('#profileAddresscountry').typeahead(null, {
            displayKey: 'name',
            valueKey: "iso_code",
            source: countriesBH.ttAdapter()
        });

        var selectedCountry = profileAddressWrap.find('[name=country]').val();
        if (selectedCountry){
            var sel = getCountries().filter(function (item) {
                return item.iso_code === selectedCountry;
            });
            if (sel.length){
                profileAddressWrap.find('#profileAddresscountry').typeahead('val', sel[0].name);
            }
        }

        profileAddressWrap.find('#profileAddresscountry').on("typeahead:selected", function(e, datum) {
            profileAddressWrap.find('[name=country]').val(datum.iso_code);
        });
    }
    
    if($('.profile-details-component').length > 0) {
        initProfile();
        initOrgTypeAhead();
    }

    initLeadContactAddresses();
    initProfileCountryList();
});