  let originalData = [];
        let encodedData = [];
        let receivedData = [];
        let errorPositions = [];
        let dataSize = 8;
        let totalBits = 0;

        // Hamming kodu için gerekli parite bit sayısını hesapla
        function calculateParityBits(dataBits) {
            let parityBits = 0;
            while (Math.pow(2, parityBits) < dataBits + parityBits + 1) {
                parityBits++;
            }
            return parityBits;
        }

        // Hamming kodu oluştur
        function hammingEncode(data) {
            const dataBits = data.length;
            const parityBits = calculateParityBits(dataBits);
            const totalBits = dataBits + parityBits + 1; // +1 için genel parite
            
            let encoded = new Array(totalBits).fill(0);
            let dataIndex = 0;

            // Veri bitlerini yerleştir (güç of 2 pozisyonları hariç)
            for (let i = 1; i < totalBits; i++) {
                if (!isPowerOfTwo(i)) {
                    encoded[i] = parseInt(data[dataIndex]);
                    dataIndex++;
                }
            }

            // Parite bitlerini hesapla
            for (let i = 0; i < parityBits; i++) {
                const parityPos = Math.pow(2, i);
                let parity = 0;
                
                for (let j = 1; j < totalBits; j++) {
                    if ((j & parityPos) !== 0) {
                        parity ^= encoded[j];
                    }
                }
                encoded[parityPos] = parity;
            }

            // Genel parite biti (SEC-DED için)
            let overallParity = 0;
            for (let i = 1; i < totalBits; i++) {
                overallParity ^= encoded[i];
            }
            encoded[0] = overallParity;

            return encoded;
        }

        // Sendrom hesapla
        function calculateSyndrome(received) {
            const parityBits = calculateParityBits(dataSize);
            let syndrome = 0;

            for (let i = 0; i < parityBits; i++) {
                const parityPos = Math.pow(2, i);
                let parity = 0;
                
                for (let j = 1; j < received.length; j++) {
                    if ((j & parityPos) !== 0) {
                        parity ^= received[j];
                    }
                }
                
                if (parity !== 0) {
                    syndrome += parityPos;
                }
            }

            return syndrome;
        }

        // Genel parite kontrol
        function checkOverallParity(received) {
            let parity = 0;
            for (let i = 0; i < received.length; i++) {
                parity ^= received[i];
            }
            return parity;
        }

        function isPowerOfTwo(n) {
            return n > 0 && (n & (n - 1)) === 0;
        }

        function updateDataSize() {
            dataSize = parseInt(document.getElementById('dataSize').value);
            document.getElementById('dataInput').maxLength = dataSize;
            document.getElementById('dataInput').placeholder = `örn: ${'1'.repeat(dataSize)}`;
            resetSimulation();
        }

        function generateRandom() {
            let randomData = '';
            for (let i = 0; i < dataSize; i++) {
                randomData += Math.random() < 0.5 ? '0' : '1';
            }
            document.getElementById('dataInput').value = randomData;
            encodeData();
        }

        function encodeData() {
            const input = document.getElementById('dataInput').value;
            if (!/^[01]+$/.test(input) || input.length !== dataSize) {
                updateStatus(`Lütfen ${dataSize} bitlik geçerli bir binary veri girin (sadece 0 ve 1)`, 'error');
                return;
            }

            originalData = input.split('').map(bit => parseInt(bit));
            encodedData = hammingEncode(originalData);
            receivedData = [...encodedData];
            errorPositions = [];
            totalBits = encodedData.length;

            displayBits();
            createBitSelector();
            updateStatus('Veri başarıyla kodlandı. Hata enjeksiyonu yapabilirsiniz.', 'success');
        }

        function displayBits() {
            displayEncodedBits();
            displayReceivedBits();
            updateSyndromes();
        }

        function displayEncodedBits() {
            const container = document.getElementById('encodedBits');
            container.innerHTML = '';
            
            encodedData.forEach((bit, index) => {
                const bitElement = document.createElement('div');
                bitElement.className = `bit ${getBitClass(index)}`;
                bitElement.textContent = bit;
                
                const label = document.createElement('div');
                label.className = 'bit-label';
                label.textContent = index === 0 ? 'P' : (isPowerOfTwo(index) ? `P${Math.log2(index)}` : `D${getDataBitIndex(index)}`);
                bitElement.appendChild(label);
                
                container.appendChild(bitElement);
            });
        }

        function displayReceivedBits() {
            const container = document.getElementById('receivedBits');
            container.innerHTML = '';
            
            receivedData.forEach((bit, index) => {
                const bitElement = document.createElement('div');
                bitElement.className = `bit ${getBitClass(index)}`;
                if (errorPositions.includes(index)) {
                    bitElement.classList.add('error-bit');
                    bitElement.classList.remove('data-bit', 'parity-bit');
                }
                bitElement.textContent = bit;
                
                const label = document.createElement('div');
                label.className = 'bit-label';
                label.textContent = index === 0 ? 'P' : (isPowerOfTwo(index) ? `P${Math.log2(index)}` : `D${getDataBitIndex(index)}`);
                bitElement.appendChild(label);
                
                container.appendChild(bitElement);
            });
        }

        function getBitClass(index) {
            if (index === 0 || isPowerOfTwo(index)) {
                return 'parity-bit';
            }
            return 'data-bit';
        }

        function getDataBitIndex(position) {
            let dataIndex = 0;
            for (let i = 1; i < position; i++) {
                if (!isPowerOfTwo(i)) {
                    dataIndex++;
                }
            }
            return dataIndex + 1;
        }

        function createBitSelector() {
            const container = document.getElementById('bitSelector');
            container.innerHTML = '';
            
            for (let i = 0; i < totalBits; i++) {
                const btn = document.createElement('button');
                btn.className = 'bit-select-btn';
                btn.textContent = i;
                btn.onclick = () => toggleBitSelection(i, btn);
                container.appendChild(btn);
            }
        }

        function toggleBitSelection(index, button) {
            if (errorPositions.includes(index)) {
                errorPositions = errorPositions.filter(pos => pos !== index);
                button.classList.remove('selected');
            } else {
                errorPositions.push(index);
                button.classList.add('selected');
            }
        }

        function injectErrors() {
            if (encodedData.length === 0) {
                updateStatus('Önce veri kodlama işlemini yapın.', 'error');
                return;
            }

            errorPositions.forEach(pos => {
                receivedData[pos] = 1 - receivedData[pos]; // Bit'i ters çevir
            });

            displayReceivedBits();
            updateSyndromes();
            analyzeErrors();
        }

        function correctErrors() {
            if (encodedData.length === 0) {
                updateStatus('Önce veri kodlama işlemini yapın.', 'error');
                return;
            }

            const syndrome = calculateSyndrome(receivedData);
            const overallParity = checkOverallParity(receivedData);

            if (syndrome === 0 && overallParity === 0) {
                updateStatus('Hata tespit edilmedi. Veri doğru.', 'success');
                return;
            }

            if (syndrome !== 0 && overallParity !== 0) {
                // Tek bit hatası - düzeltilebilir
                receivedData[syndrome] = 1 - receivedData[syndrome];
                errorPositions = errorPositions.filter(pos => pos !== syndrome);
                updateStatus(`Tek bit hatası ${syndrome}. pozisyonda tespit edildi ve düzeltildi.`, 'success');
            } else if (syndrome !== 0 && overallParity === 0) {
                updateStatus('Çift bit hatası tespit edildi. Bu hata düzeltilemez!', 'error');
                return;
            } else if (syndrome === 0 && overallParity !== 0) {
                updateStatus('Genel parite bitinde hata tespit edildi ve düzeltildi.', 'success');
                receivedData[0] = 1 - receivedData[0];
                errorPositions = errorPositions.filter(pos => pos !== 0);
            }

            displayReceivedBits();
            updateSyndromes();
        }

        function analyzeErrors() {
            const syndrome = calculateSyndrome(receivedData);
            const overallParity = checkOverallParity(receivedData);
            
            let message = '';
            let type = 'success';

            if (syndrome === 0 && overallParity === 0) {
                message = '✅ Hata tespit edilmedi. Veri doğru.';
            } else if (syndrome !== 0 && overallParity !== 0) {
                message = `⚠️ Tek bit hatası tespit edildi (Pozisyon: ${syndrome}). Bu hata düzeltilebilir.`;
                type = 'warning';
            } else if (syndrome !== 0 && overallParity === 0) {
                message = '❌ Çift bit hatası tespit edildi. Bu hata düzeltilemez!';
                type = 'error';
            } else if (syndrome === 0 && overallParity !== 0) {
                message = '⚠️ Genel parite bitinde hata tespit edildi. Bu hata düzeltilebilir.';
                type = 'warning';
            }

            updateStatus(message, type);
        }

        function updateSyndromes() {
            const originalSyndrome = document.getElementById('originalSyndrome');
            originalSyndrome.textContent = '000';
            originalSyndrome.className = 'syndrome-value syndrome-zero';

            const syndrome = calculateSyndrome(receivedData);
            const syndromeElement = document.getElementById('syndrome');
            syndromeElement.textContent = syndrome.toString(2).padStart(3, '0');
            syndromeElement.className = `syndrome-value ${syndrome === 0 ? 'syndrome-zero' : 'syndrome-nonzero'}`;
        }

        function updateStatus(message, type) {
            const statusElement = document.getElementById('statusMessage');
            statusElement.textContent = message;
            statusElement.className = `status-message status-${type}`;
        }

        function resetSimulation() {
            originalData = [];
            encodedData = [];
            receivedData = [];
            errorPositions = [];
            
            document.getElementById('encodedBits').innerHTML = '';
            document.getElementById('receivedBits').innerHTML = '';
            document.getElementById('bitSelector').innerHTML = '';
            document.getElementById('dataInput').value = '';
            
            updateStatus('Sistem sıfırlandı. Yeni veri girişi yapabilirsiniz.', 'success');
            
            const originalSyndrome = document.getElementById('originalSyndrome');
            originalSyndrome.textContent = '000';
            originalSyndrome.className = 'syndrome-value syndrome-zero';
            
            const syndrome = document.getElementById('syndrome');
            syndrome.textContent = '000';
            syndrome.className = 'syndrome-value syndrome-zero';
        }

        // Event listeners
        document.getElementById('dataSize').addEventListener('change', updateDataSize);
        
        // Initialize
        updateDataSize();
