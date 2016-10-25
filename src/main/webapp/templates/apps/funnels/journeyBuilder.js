'use strict';

var JBApp = {
    funnel: null,
    initialized: false,
    getNodeInfo: function (node) {
        for (var key in node) {
            if (node.hasOwnProperty(key)) {
                return [key, node[key]];
            }
        }

        return null;
    },
    getNodeType: function (node, typeName) {
        var nodeType = JBNodes[typeName];
        if (nodeType == null) {
            flog('getNodeType by "nodeType" property', node.nodeType);
            if (node.nodeType) {
                nodeType = JBNodes[node.nodeType];
            }
        }

        flog("getNodeType", node, typeName, "nodeType=" + nodeType);

        return nodeType;
    },
    getNodeInfoById: function (id) {
        for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
            var node = JBApp.funnel.nodes[i];
            var nodeInfo = JBApp.getNodeInfo(node);

            if (nodeInfo[1].nodeId === id) {
                return nodeInfo;
                break;
            }
        }
    },
    getNodeTypeById: function (id) {
        flog("getNodeTypeById", JBApp.funnel.nodes);
        for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
            var node = JBApp.funnel.nodes[i];
            var nodeInfo = JBApp.getNodeInfo(node);

            if (nodeInfo[1].nodeId === id) {
                flog('Found node info', nodeInfo, 'type=' + nodeInfo[0]);

                if (nodeInfo[1].nodeType) {
                    return nodeInfo[1].nodeType; // this is to allow customGoal etc to be used for many different node types
                }

                return nodeInfo[0];
                break;
            }
        }
    },
    reloadFunnelJson: function () {
        flog('reloadFunnelJson');

        $('#funnelJson').reloadFragment({
            whenComplete: function () {
                JBApp.parseFunnel();
            }
        });
    },
    parseFunnel: function () {
        flog('parseFunnel');

        try {
            JBApp.funnel = $.parseJSON($('#funnelJson').val());
        } catch (e) {
            flog('no funnel found');
            JBApp.funnel = {
                nodes: []
            };
        }
    },
    newNode: function (node, type) {
        flog('newNode', node, type);

        var nodePorts = '';
        var divTypeClass = type;
        var nodeDef = JBNodes[type];
        if (nodeDef == null) {
            nodeDef = JBNodes[node.nodeType];
            divTypeClass = node.nodeType;
        }

        if (nodeDef == null) {
            flog('WARN: Could not find node type=' + type, ', nodeType=' + node.nodeType, 'node=', node);
            return null;
        }

        var nodeDiv = document.createElement('div');
        nodeDiv.className = 'node ' + divTypeClass;
        nodeDiv.id = node.nodeId;
        nodeDiv.setAttribute('data-type', divTypeClass);
        nodeDiv.style.left = node.x + 'px';
        nodeDiv.style.top = node.y + 'px';

        for (var portName in nodeDef.ports) {
            var portData = nodeDef.ports[portName];
            var portClass = '';
            switch (portName) {
                case 'decisionDefault':
                    portClass = 'ep-red';
                    break;

                case 'decisionChoices':
                    portClass = 'ep-green';
                    break;

                case 'timeoutNode':
                    portClass = 'ep-timeout';
                    break;

                default:
                    portClass = 'ep-basic';
            }

            nodePorts += '<span title="' + portData.title + '" class="ep ' + portClass + '" data-name="' + portName + '"></span>';
        }

        var nodeName = node.title ? '<span class="node-title-inner">' + node.title + '</span>' : '<span class="node-title-inner text-muted">Enter title</span>';
        var nodeHtml = '';
        nodeHtml += '<div class="title"> ' + nodeDef.title;
        nodeHtml += '   <span class="node-buttons clearfix">';
        if (nodeDef.settingEnabled) {
            nodeHtml += '   <span class="btnNodeDetails" title="Edit details"><i class="fa fa-fw fa-cog"></i></span>';
        }
        nodeHtml += '       <span class="btnNodeDelete" title="Delete this node"><i class="fa fa-fw fa-trash"></i></span>';
        nodeHtml += '   </span>';
        nodeHtml += '</div>';
        nodeHtml += '<div class="inner">';
        nodeHtml += '   <span class="nodeTitle btnNodeEdit">' + nodeName + ' <i class="fa fa-pencil"></i></span>' + nodePorts;
        nodeHtml += '</div>';

        nodeDiv.innerHTML = nodeHtml;
        JBApp.jspInstance.getContainer().appendChild(nodeDiv);

        var nodeBackdrop = document.createElement('div');
        nodeBackdrop.className = 'node-backdrop ' + divTypeClass;
        nodeBackdrop.id = node.nodeId + '-backdrop';
        nodeBackdrop.style.left = node.x + 'px';
        nodeBackdrop.style.top = node.y + 'px';
        JBApp.jspInstance.getContainer().appendChild(nodeBackdrop);

        JBApp.initNode(nodeDiv, type, node);
        return nodeDiv;
    },
    getConnectorStyle: function (portName) {
        var color = '';
        switch (portName) {
            case 'timeoutNode':
                color = '#e5910f';
                break;

            case 'decisionDefault':
                color = '#f00';
                break;

            case 'decisionChoices':
                color = '#008000';
                break;

            default:
                color = '#e50051';
        }

        return {
            strokeStyle: color,
            lineWidth: 2,
            outlineColor: 'transparent',
            outlineWidth: 4
        }
    },
    initNode: function (nodeDiv, type, node) {
        flog('initNode', nodeDiv, type);

        var nodeBackdrop = $('#' + nodeDiv.id + '-backdrop');
        JBApp.jspInstance.draggable(nodeDiv, {
            stop: function () {
                JBApp.saveFunnel();
            },
            drag: function () {
                nodeBackdrop.css({
                    top: nodeDiv.style.top,
                    left: nodeDiv.style.left
                });
            },
            grid: [10, 10]
        });

        var nodeType = JBApp.getNodeType(node, type);
        if (nodeType == null) {
            flog('WARN: Could not find node type=' + type, 'node=', node);
            return;
        }

        for (var portName in nodeType.ports) {
            JBApp.jspInstance.makeSource(nodeDiv, {
                filter: '[data-name=' + portName + ']',
                connectorStyle: JBApp.getConnectorStyle(portName),
                connectionType: portName,
                maxConnections: -1
            });
        }

        JBApp.jspInstance.makeTarget(nodeDiv, {
            dropOptions: {
                hoverClass: 'dragHover'
            },
            allowLoopback: false
        });
    },
    connectionTypes: {
        nextNodeId: [1, 0.775, 1, 0],
        timeoutNode: [1, 0.925, 1, 0]
    },
    initConnection: function (node, type) {
        flog('initConnection', node, type);

        var nodeType = JBApp.getNodeType(node, type);
        if (nodeType == null) {
            return null;
        }

        for (var portName in nodeType.ports) {
            var connectionType = portName;

            if (portName === 'decisionChoices') {
                for (var key in node.choices) {
                    JBApp.jspInstance.connect({
                        source: node.nodeId,
                        target: key,
                        type: connectionType
                    });
                }
            } else {
                if (portName === 'decisionDefault') {
                    portName = 'nextNodeId';
                    connectionType = 'decisionDefault';
                }

                if (node[portName]) {
                    JBApp.jspInstance.connect({
                        source: node.nodeId,
                        target: node[portName],
                        type: connectionType
                    });
                }
            }
        }
    },
    saveFunnel: function (message, callback) {
        flog('saveFunnel', message);

        var builderStatus = $('#builder-status');
        builderStatus.stop().show().html('Saving...');

        for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
            var node = JBApp.funnel.nodes[i];
            for (var key in node) {
                if (node.hasOwnProperty(key)) {
                    var nodeId = node[key].nodeId;
                    var nodeDiv = $('#' + nodeId);

                    if (nodeDiv.length > 0) {
                        node[key].x = parseInt(nodeDiv.css('left').replace('px', ''));
                        node[key].y = parseInt(nodeDiv.css('top').replace('px', ''));
                    } else {
                        flog("WARN: could not find nodeid ", nodeId, "in node=", node[key]);
                    }
                }
            }
        }

        $.ajax({
            url: 'funnel.json',
            type: 'PUT',
            data: JSON.stringify(JBApp.funnel, null, 4),
            success: function () {
                builderStatus.html(message || 'Funnel is saved').delay(2000).fadeOut(2000);

                if (typeof callback === 'function') {
                    callback();
                }
            },
            error: function (e) {
                Msg.error(e.status + ': ' + e.statusText);
            }
        });
    },
    deleteConnection: function (connection) {
        flog('deleteConnection', connection);

        var portName = connection.endpoints[0].connectionType;
        for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
            var node = JBApp.funnel.nodes[i];
            var nodeInfo = JBApp.getNodeInfo(node);
            var nodeData = nodeInfo[1];
            var nodeType = nodeInfo[0];

            if (nodeData.nodeId === connection.sourceId) {
                if (nodeType === 'decision') {
                    if (connection.hasType('decisionDefault')) {
                        nodeData.nextNodeId = '';
                    } else if (connection.hasType('decisionChoices')) {
                        if (nodeData.choices.hasOwnProperty(connection.targetId)) {
                            delete nodeData.choices[connection.targetId];
                        }
                    }
                } else {
                    nodeData[portName] = '';
                }

                break;
            }
        }
    },
    hideSettingPanel: function () {
        flog('hideSettingPanel');

        var settingPanel = $('.panel-setting');
        settingPanel.removeClass('showed');
        settingPanel.find('.active').removeClass('active');
        JBApp.currentSettingNode = null;
        JBApp.currentSettingNodeId = null;
    },
    showSettingPanel: function (formName) {
        flog('showSettingPanel-', formName);

        var titleSelector = '';
        var formSelector = '';
        if (typeof formName !== 'string') {
            var node = formName;
            var nodeType = JBApp.getNodeTypeById(node.nodeId);
            flog("nodeType=", nodeType, " for nodeId=", node.nodeId);
            JBApp.currentSettingNode = node;
            JBApp.currentSettingNodeId = node.nodeId;
            formSelector = '.panel-edit-details.panel-setting-' + nodeType;
            titleSelector = '.panel-edit-details';
        } else {
            formSelector = '.panel-' + formName;
            titleSelector = '.panel-' + formName;
        }

        var settingPanel = $('.panel-setting');
        settingPanel.addClass('showed');
        settingPanel.find('.active').removeClass('active');

        var settingPanelBody = settingPanel.find('.panel-body');
        var formPanel = settingPanelBody.find(formSelector);
        flog("showSettingPanel. formSelector=", formSelector, "formPanel=", formPanel, "settingPanelBody=", settingPanelBody);
        formPanel.addClass('active');

        var settingPanelHeading = settingPanel.find('.panel-heading');
        settingPanelHeading.find(titleSelector).addClass('active');

        setTimeout(function () {
            formPanel.find('input:text').first().trigger('focus');
        }, 250);
    },

    standardGoalSettingControls:
        '<div class="form-group">' +
        '    <div class="col-md-12">' +
        '        <label>Stage</label>' +
        '        <select class="form-control stageName"></select>' +
        '    </div>' +
        '</div>' +
        '<div class="form-group">' +
        '    <div class="col-md-12">' +
        '        <label>Source</label>' +
        '        <select class="form-control source"></select>' +
        '    </div>' +
        '</div>' +
        '<div class="form-group">' +
        '    <div class="col-md-12">' +
        '        <label>Cost</label>' +
        '        <input type="number" class="form-control cost" value="" />' +
        '    </div>' +
        '</div>' +
        '<div class="form-group">' +
        '    <div class="col-md-12">' +
        '        <label>Probability</label>' +
        '        <input type="number" class="form-control probability" value="" />' +
        '    </div>' +
        '</div>' +
        '<div class="form-group">' +
        '    <div class="col-md-12">' +
        '        <label>Timeout</label>' +
        '        <div class="input-group">' +
        '            <input type="number" class="form-control timeout-multiples numeric" />' +
        '            <div class="input-group-btn">' +
        '                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="timeout-units-preview"></span>' +
        '                    <span class="caret"></span>' +
        '                </button>' +
        '                <input type="hidden" class="timeout-units" value="" />' +
        '                <ul class="dropdown-menu dropdown-menu-right timeout-units-selector">' +
        '                    <li><a href="#" data-value="y">Years</a></li>' +
        '                    <li><a href="#" data-value="M">Months</a></li>' +
        '                    <li><a href="#" data-value="w">Weeks</a></li>' +
        '                    <li><a href="#" data-value="d">Days</a></li>' +
        '                    <li><a href="#" data-value="h">Hours</a></li>' +
        '                    <li><a href="#" data-value="m">Minutes</a></li>' +
        '                </ul>' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '</div>' +
        '<div class="form-group">' +
        '    <div class="col-md-12">' +
        '        <label>Time</label>' +
        '        <input type="number" class="form-control time" value="" />' +
        '        <em class="small help-block text-muted">(Optional) If set this will cause a timer to execute at a particular time, as well as after the specified delay.</em>' +
        '    </div>' +
        '</div>',
    initStandardGoalSettingControls: function (form) {
        form.find('.timeout-units-selector li').on('click', function (e) {
            e.preventDefault();

            var a = $(this).find('a');
            var text = a.text().trim();
            var value = a.attr('data-value');

            form.find('.timeout-units').val(value);
            form.find('.timeout-units-preview').html(text);
        });
    },
    saveStandardGoalSetting: function (form) {
        var timeoutUnits = form.find('.timeout-units').val();
        var timeoutMultiples = form.find('.timeout-multiples').val();
        var stageName = form.find('.stageName').val();
        var source = form.find('.source').val();
        var cost = form.find('.cost').val();
        var probability = form.find('.probability').val();
        var time = form.find('.time').val();

        JBApp.currentSettingNode.timeoutUnits = timeoutUnits || null;
        JBApp.currentSettingNode.timeoutMultiples = timeoutMultiples || null;
        JBApp.currentSettingNode.stageName = stageName || null;
        JBApp.currentSettingNode.source = source || null;
        JBApp.currentSettingNode.cost = cost || null;
        JBApp.currentSettingNode.probability = probability || null;
        JBApp.currentSettingNode.timerTime = time || null;
    },
    showStandardGoalSettingControls: function (form, node) {
        if (node.timeoutUnits !== null) {
            form.find('.timeout-units-selector li a').filter('[data-value=' + node.timeoutUnits + ']').trigger('click');
        } else {
            form.find('.timeout-units').val('');
            form.find('.timeout-units-preview').html('');
        }
        form.find('.timeout-multiples').val(node.timeoutMultiples !== null ? node.timeoutMultiples : '');

        var stagesOptionStr = '<option value="">[No stage selected]</option>';
        if (JBApp.funnel.stages && $.isArray(JBApp.funnel.stages)) {
            for (var i = 0; i < JBApp.funnel.stages.length; i++) {
                stagesOptionStr += '<option value="' + JBApp.funnel.stages[i].name + '">' + JBApp.funnel.stages[i].desc + '</option>';
            }
        }
        form.find('.stageName').html(stagesOptionStr).val(node.stageName !== null ? node.stageName : '');

        var sourceOptionStr = '<option value="">[No source selected]</option>';
        if (JBApp.funnel.sources && $.isArray(JBApp.funnel.sources)) {
            for (var i = 0; i < JBApp.funnel.sources.length; i++) {
                sourceOptionStr += '<option value="' + JBApp.funnel.sources[i] + '">' + JBApp.funnel.sources[i] + '</option>';
            }
        }
        form.find('.source').html(sourceOptionStr).val(node.source !== null ? node.source : '');

        form.find('.cost').val(node.cost !== null ? node.cost : '');
        form.find('.probability').val(node.probability !== null ? node.probability : '');
        form.find('.time').val(node.timerTime !== null ? node.timerTime : '');
    }
};

jsPlumb.ready(function () {
    JBApp.parseFunnel();

    // setup some defaults for jsPlumb.
    var instance = jsPlumb.getInstance({
        Endpoint: ['Dot', {
            radius: 2
        }],
        Connector: ['Flowchart', {
            cornerRadius: 5,
            gap: 1,
            stub: 20,
            alwaysRespectStubs: true,
            midpoint: 1
        }],
        HoverPaintStyle: {
            strokeStyle: '#1e8151',
            lineWidth: 2
        },
        ConnectionOverlays: [
            ['Arrow', {
                location: 1,
                id: 'arrow',
                length: 10,
                width: 10,
                foldback: 0.5
            }],
            ['Label', {
                label: '',
                id: 'label',
                cssClass: 'aLabel'
            }],
            ['Custom', {
                create: function () {
                    return $('<div><a href="#" title="Click to delete connection" class="buttonX"><i class="fa fa-times-circle"></i></a></div>');
                },
                events: {
                    click: function (labelOverlay, e) {
                        flog('Click on label overlay', labelOverlay, labelOverlay.component);

                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();

                        labelOverlay.component.setParameter('clickedButtonX', true);

                        if (confirm('Are you sure you want to delete this connection?')) {
                            labelOverlay.component.setParameter('clickedButtonXCancelled', false);
                        } else {
                            labelOverlay.component.setParameter('clickedButtonXCancelled', true);
                        }
                    }
                },
                location: 0.7,
                id: 'buttonX',
                visible: false
            }]
        ],
        Container: 'paper'
    });
    JBApp.jspInstance = instance;

    // Load connection types position from JBNodes
    for (var nodeName in JBNodes) {
        var index = 0;
        $.each(JBNodes[nodeName].ports, function (portName) {
            if (portName !== 'timeoutNode' && portName !== 'nextNodeId') {
                var positionValue;

                switch (index) {
                    case 0:
                        positionValue = [1, 0.925, 1, 0];
                        break;

                    case 1:
                        positionValue = [1, 0.775, 1, 0];
                        break;

                    case 2:
                        positionValue = [1, 0.63, 1, 0];
                        break;

                    case 3:
                        positionValue = [1, 0.475, 1, 0];
                        break;

                    case 4:
                        positionValue = [1, 0.325, 1, 0];
                        break;
                }

                JBApp.connectionTypes[portName] = positionValue;
            }

            index++;
        });
    }

    // Register connection types
    for (var typeName in JBApp.connectionTypes) {
        var outPortPosition = JBApp.connectionTypes[typeName];

        instance.registerConnectionType(typeName, {
            anchors: [outPortPosition, ['LeftMiddle', 'TopCenter', 'BottomCenter']],
            connector: 'StateMachine'
        });
    }

    instance.bind('click', function (connection) {
        if (connection && connection.getParameter('clickedButtonX') === true) {
            var clickedButtonXCancelled = connection.getParameter('clickedButtonXCancelled');
            if (clickedButtonXCancelled === false) {
                JBApp.deleteConnection(connection);
                instance.detach(connection);
                JBApp.saveFunnel('Connection is deleted!');

                return false;
            }
        }
    });

    instance.bind('mouseover', function (connection) {
        if (connection.getOverlay('buttonX')) {
            connection.getOverlay('buttonX').show();
        }
    });

    instance.bind('mouseout', function (connection) {
        if (connection.getOverlay('buttonX')) {
            connection.getOverlay('buttonX').hide();
        }
    });

    instance.bind('connection', function (info) {
        var type = info.source.getAttribute('data-type');
        var portName = info.sourceEndpoint.connectionType;
        var div = $(info.source);
        var nodeId = div.attr("id");
        var node = JBApp.getNodeInfoById(nodeId)[1];

        var nodeType = JBApp.getNodeType(node, type);
        flog("bind connection", nodeType);
        var portData = nodeType.ports[portName];
        var label = portData.label;
        var maxConnections = portData.maxConnections;
        var connection = info.connection;

        flog('In connection, nodeType: ' + type + ', portName: ' + portName + ', label: ' + label + ', maxConnections: ' + maxConnections, info, connection);

        // Check limitation of connections
        if (maxConnections !== -1) {
            var existingConnections = 0;
            instance.select({
                source: connection.sourceId
            }).each(function (item) {
                if (item.endpoints.length !== 0) {
                    if (item.endpoints[0].connectionType === portName && item.endpoints[0].connections && item.endpoints[0].connections.length !== 0) {
                        existingConnections++;
                    }

                    return;
                }
            });

            if (existingConnections > maxConnections) {
                Msg.warning('You reached maximum connections (' + portData.maxConnections + ') of <b>' + portData.title + '</b>. Please delete current connection and make a new one.');
                instance.detach(connection);
                return;
            }
        }

        // Check connection between 2 nodes
        existingConnections = 0;
        instance.select({
            source: connection.sourceId,
            target: connection.targetId
        }).each(function (item) {
            if (item.endpoints.length !== 0) {
                if (item.endpoints[0].connectionType === portName && item.endpoints[0].connections && item.endpoints[0].connections.length !== 0) {
                    existingConnections++;
                }

                return;
            }
        });

        if (existingConnections > 1) {
            Msg.warning('Connection between these nodes exists');
            instance.detach(connection);
            return;
        }

        // Set label
        if (label) {
            connection.getOverlay('label').setLabel(label);
            $(connection.getOverlay('label').canvas).addClass('showed');
        }

        if (JBApp.initialized) {
            flog('New connection was made', info.connection);

            for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
                var node = JBApp.funnel.nodes[i];
                var nodeInfo = JBApp.getNodeInfo(node);
                var nodeData = nodeInfo[1];

                if (nodeData.nodeId === connection.sourceId) {
                    if (nodeInfo[0] === 'decision') {
                        flog('Started from a decision node');

                        if (connection.hasType('decisionDefault')) {
                            nodeData.nextNodeId = connection.targetId;
                        } else if (connection.hasType('decisionChoices')) {
                            if (!nodeData.choices) {
                                nodeData.choices = {};
                            }
                            nodeData.choices[connection.targetId] = {};
                        }
                    } else {
                        nodeData[portName] = connection.targetId;
                    }

                    break;
                }
            }

            JBApp.saveFunnel();
        }
    });

    // suspend drawing and initialise.
    instance.batch(function () {
        if (JBApp.funnel && JBApp.funnel.nodes && JBApp.funnel.nodes.length > 0) {
            var journeyBuilder = $('#journeyBuilder');
            $('a[href=#journeyBuilder]').on('click', function () {
                if (!journeyBuilder.hasClass('initialized')) {
                    JBApp.initialized = false;

                    for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
                        var node = JBApp.funnel.nodes[i];
                        var nodeInfo = JBApp.getNodeInfo(node);
                        JBApp.newNode(nodeInfo[1], nodeInfo[0]);
                    }

                    for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
                        var node = JBApp.funnel.nodes[i];
                        var nodeInfo = JBApp.getNodeInfo(node);
                        JBApp.initConnection(nodeInfo[1], nodeInfo[0]);
                    }

                    JBApp.initialized = true;
                    journeyBuilder.addClass('initialized')
                }
            }).trigger('click');
        }
    });

    JBApp.initialized = true;
    flog('JBApp init done');
});

function initJourneyBuilder() {
    flog('initJourneyBuilder');

    initSideBar();
    initSaveButton();
    initNodeActions();
    initSettingPanel();
    initBuilderHeight();
}

function initSettingPanel() {
    flog('initSettingPanel');

    var panelSetting = $('.panel-setting');
    var panelSettingBody = panelSetting.find('.panel-body');

    panelSetting.find('.btn-close-setting').on('click', function (e) {
        e.preventDefault();

        JBApp.hideSettingPanel();
    });

    panelSetting.find('.btn-save-setting').on('click', function (e) {
        e.preventDefault();

        panelSettingBody.find('form.active').trigger('submit');
    });

    for (var nodeType in JBNodes) {
        var nodeDef = JBNodes[nodeType];

        if (nodeDef.settingEnabled) {
            if (typeof nodeDef.initSettingForm === 'function') {
                var form = $('<form class="panel-setting-' + nodeType + ' panel-edit-details"></form>');
                panelSettingBody.append(form);
                nodeDef.initSettingForm(form);
            } else {
                $.error('"initSettingForm" method of ' + nodeType + ' does not exist!');
            }
        }
    }

    initTitleForm();
}

function initTitleForm() {
    flog('initTitleForm');

    var form = $('form.panel-edit-title');
    form.on('submit', function (e) {
        e.preventDefault();

        updateNode(form);
    });
}

function updateNode(form) {
    flog('updateNode', form);

    var sourceId = form.find('[name=sourceId]').val();
    var title = form.find('[name=title]').val();
    for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
        var node = JBApp.funnel.nodes[i];
        for (var key in node) {
            if (node[key].nodeId === sourceId) {
                node[key].title = title;

                JBApp.saveFunnel('Title is updated', function () {
                    var nodeTitleInner = $('#' + sourceId).find('.nodeTitle .node-title-inner');
                    if (nodeTitleInner.hasClass('text-muted')) {
                        nodeTitleInner.removeClass('text-muted')
                    }
                    nodeTitleInner.html(title);

                    JBApp.hideSettingPanel();
                });

                break;
            }
        }
    }
}

function initBuilderHeight() {
    flog('initBuilderHeight');

    var builder = $('#builder');
    var tabbable = builder.closest('.tabbable');
    var navTabs = tabbable.find('.nav-tabs');
    var container = builder.closest('.container');

    builder.css('height', container.innerHeight() - navTabs.innerHeight());
}

function initSideBar() {
    flog('initSideBar');

    var rightPanel = $('.right-panel');

    var snippetsStr = '';
    for (var nodeType in JBNodes) {
        var nodeDef = JBNodes[nodeType];

        snippetsStr += '<li data-type="' + nodeType + '" class="list-group-item">';
        snippetsStr += '    <img src="' + nodeDef.previewUrl + '" class="img-responsive" />';
        snippetsStr += '</li>';
    }
    rightPanel.find('.list-group').html(snippetsStr);

    rightPanel.find('.list-group, .panel-body').niceScroll({
        cursorcolor: '#999',
        cursorwidth: 6,
        railpadding: {
            top: 0,
            right: 0,
            left: 0,
            bottom: 0
        },
        cursorborder: '',
        disablemutationobserver: true
    });

    rightPanel.find('.list-group-item').draggable({
        revert: 'invalid',
        tolerance: 'pointer',
        helper: 'clone'
    });

    var paper = $('#paper');
    paper.droppable({
        drop: function (event, ui) {
            var type = ui.draggable.attr('data-type');
            var node = {
                nodeId: type + '-' + uuid(),
                nodeType: type,
                x: ui.offset.left - paper.offset().left + paper.scrollLeft(),
                y: ui.offset.top - paper.offset().top + paper.scrollTop()
            };
            var nodeInfo = JBNodes[type];
            var nodeType = type;
            if (nodeInfo.nodeTypeClass) {
                nodeType = nodeInfo.nodeTypeClass;
            }

            var objToPush = {};
            objToPush[nodeType] = node;

            JBApp.newNode(node, type);
            JBApp.funnel.nodes.push(objToPush);
            JBApp.saveFunnel('New node is added!');
            flog('New node added: type=' + nodeType + ' nodeData: \n' + JSON.stringify(objToPush, null, 4));
        }
    });
}

function showTitleForm(node) {
    flog('showTitleForm', node);

    var title = node.title || '';
    var form = $('form.panel-edit-title');
    form.find('[name=title]').val(title);
    form.find('[name=sourceId]').val(node.nodeId);
    JBApp.showSettingPanel('edit-title');
}

function initNodeActions() {
    flog('initNodeActions');

    $(document.body).on('click', '.btnNodeEdit', function (e) {
        e.preventDefault();

        var nodeId = $(this).closest('.node').attr('id');
        for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
            var node = JBApp.funnel.nodes[i];
            var nodeData = JBApp.getNodeInfo(node)[1];

            if (nodeData.nodeId === nodeId) {
                showTitleForm(nodeData);
                break;
            }
        }
    });

    $(document.body).on('click', '.btnNodeDetails', function (e) {
        e.preventDefault();

        var domElement = $(this).closest('.node');
        var id = domElement.attr('id');
        var type = domElement.attr('data-type');
        var nodeData = JBApp.getNodeInfoById(id)[1];

        if (typeof JBNodes[type].showSettingForm === 'function') {
            JBNodes[type].showSettingForm($('.panel-setting-' + type), nodeData);
        } else {
            $.error('"showSettingForm" method of ' + type + ' does not exist!');
        }
    });

    $(document.body).on('click', '.btnNodeDelete', function (e) {
        e.preventDefault();

        var nodeDiv = $(this).closest('.node');

        if (confirm('Are you sure you want to delete this node?')) {
            var id = nodeDiv.attr('id');
            deleteNode(id);
            JBApp.jspInstance.remove(id);
            $('#' + id + '-backdrop').remove();
            JBApp.saveFunnel('Node is deleted!');
        }
    });
}

function deleteNode(nodeId) {
    flog('deleteNode', nodeId);

    var index = -1;
    for (var i = 0; i < JBApp.funnel.nodes.length; i++) {
        var node = JBApp.funnel.nodes[i];
        for (var key in node) {
            if (node[key].nodeId === nodeId) {
                index = i;
                break;
            }
        }
    }

    if (index > -1) {
        JBApp.funnel.nodes.splice(index, 1);

        // Remove connection which deleted node is source
        JBApp.jspInstance.select({
            source: nodeId
        }).each(function (connection) {
            JBApp.deleteConnection(connection);
            JBApp.jspInstance.detach(connection);
        });

        // Remove connection which deleted node is target
        JBApp.jspInstance.select({
            target: nodeId
        }).each(function (connection) {
            JBApp.deleteConnection(connection);
            JBApp.jspInstance.detach(connection);
        });
    }
}

function initSaveButton() {
    flog('initSaveButton');

    $('#btnSave').on('click', function (e) {
        e.preventDefault();

        JBApp.saveFunnel();
    });
}

function uuid() {
    return ('xxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }));
}
