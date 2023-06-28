    function generateMessageIdInputs() {
        var numMessages = document.getElementById('numMessages').value;
        var messageIdInputsDiv = document.getElementById('messageIdInputs');
        messageIdInputsDiv.innerHTML = '';

        for (var i = 1; i <= numMessages; i++) {
            var inputGroup = document.createElement('div');
            inputGroup.classList.add('input-group');

            var label = document.createElement('label');
            label.textContent = 'Message ID ' + i + ' (Hexadecimal)';
            inputGroup.appendChild(label);

            var input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Enter message ID ' + i;
            input.required = true;
            inputGroup.appendChild(input);

            var dataLengthCodeLabel = document.createElement('label');
            dataLengthCodeLabel.textContent = 'Data Length Code for ID ' + i;
            inputGroup.appendChild(dataLengthCodeLabel);

            var dataLengthCodeInput = document.createElement('input');
            dataLengthCodeInput.type = 'number';
            dataLengthCodeInput.placeholder = 'Enter data length code';
            dataLengthCodeInput.required = true;
            inputGroup.appendChild(dataLengthCodeInput);

            var cycleTimeLabel = document.createElement('label');
            cycleTimeLabel.textContent = 'Cycle Time for ID ' + i + ' (seconds)';
            inputGroup.appendChild(cycleTimeLabel);

            var cycleTimeInput = document.createElement('input');
            cycleTimeInput.type = 'number';
            cycleTimeInput.placeholder = 'Enter cycle time';
            cycleTimeInput.required = true;
            inputGroup.appendChild(cycleTimeInput);

            messageIdInputsDiv.appendChild(inputGroup);
        }
    }

    function calculateBusLoad() {
        var baudRate = document.getElementById('baudRate').value;
        var duration = document.getElementById('duration').value;
        var numMessages = document.getElementById('numMessages').value;

        var totalMessageSize = 0;
        for (var i = 1; i <= numMessages; i++) {
            var messageId = document.getElementById('messageIdInputs').querySelector('div:nth-child(' + i + ') input:nth-child(2)').value;
            var dataLengthCode = document.getElementById('messageIdInputs').querySelector('div:nth-child(' + i + ') input:nth-child(4)').value;
            var cycleTime = document.getElementById('messageIdInputs').querySelector('div:nth-child(' + i + ') input:nth-child(6)').value;

            var idType = parseInt(messageId, 16) < 0x7FF ? 'standard' : 'extended';
            var overheadBits = idType === 'standard' ? 47 : 65;
            var dataBits = dataLengthCode * 8;
            var bits = dataBits + overheadBits;
            var bitStuffing = Math.floor((bits - 13) / 5);
            var messageBits = bits + bitStuffing;
            var recurrence = Math.floor(duration / cycleTime);
            var messageSize = recurrence * messageBits;

            totalMessageSize += messageSize;
        }

        var busLoad = (totalMessageSize * 100) / (baudRate * duration);
        document.getElementById('result').innerHTML = 'CAN Bus Load: ' + busLoad.toFixed(2) + '%';
    }

    document.getElementById('numMessages').addEventListener('input', generateMessageIdInputs);
