const statusLines = document.getElementById('status-lines');

for (let i = 0; i < 30; i++) {
    const line = document.createElement('div');
    line.className = 'line';

    const randomUptime = Math.floor(Math.random() * 100);
    const randomStatus = Math.random() < 0.5 ? 'green' : Math.random() < 0.5 ? 'red' : 'orange';
    line.className += ` ${randomStatus}`;

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.innerHTML = `
        <p>Uptime: ${randomUptime}%</p>
        <p>Operational: <i class="fas fa-${randomStatus === 'green' ? 'check-circle' : randomStatus === 'red' ? 'times-circle' : 'exclamation-circle'}"></i></p>
    `;
    line.appendChild(tooltip);

    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    line.innerHTML = `<span>${dateString}</span>`;

    statusLines.appendChild(line);
}