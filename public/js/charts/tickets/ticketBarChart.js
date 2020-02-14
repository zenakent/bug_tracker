// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

const APIURL = 'http://localhost:3000/api/charts/tickets' || 'https://mauisbugtracker.herokuapp.com/api/charts/tickets'

async function ticketPriority() {
  let low = 0,
    medium = 0,
    high = 0;

  const response = await fetch(APIURL)
  const foundTickets = await response.json()
  foundTickets.tickets.forEach(ticket => {
    if (ticket.priority === 'Low') {
      low++
    } else if (ticket.priority === 'Medium') {
      medium++
    } else if (ticket.priority === 'High') {
      high++
    }
  })


  const ctx = document.getElementById('ticketPriorityChart')
  let ticketPriorityChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Low", "Medium", "High", ],
      datasets: [{
        label: 'Ticket Priority',
        data: [low, medium, high],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',

        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1
      }]
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });

}

async function ticketType() {
  let bug = 0,
    aesthetic = 0,
    feature_request = 0,
    tech_issue = 0;
  const response = await fetch(APIURL)
  const foundTickets = await response.json()

  foundTickets.tickets.forEach(ticket => {
    if (ticket.ticket_type === 'Bugs/Errors') {
      bug++
    } else if (ticket.ticket_type === 'Aesthetic') {
      aesthetic++
    } else if (ticket.ticket_type === 'Feature Request') {
      feature_request++
    } else if (ticket.ticket_type === 'Technical Issue') {
      tech_issue++
    }
  })

  const ctx = document.getElementById('ticketTypeChart')
  let ticketTypeChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Bugs/Errors', 'Aesthetic', 'Feature Request', 'Technical Issue'],
      datasets: [{
        data: [bug, aesthetic, feature_request, tech_issue],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',

        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1
      }]
    },
    options: {
      maintainAspectRatio: false,
    }
  });
};

async function ticketStatus() {
  let newStat = 0,
    open = 0,
    resolved = 0,
    in_progress = 0,
    more_info = 0;
  const response = await fetch(APIURL)
  const foundTickets = await response.json()

  foundTickets.tickets.forEach(ticket => {
    switch (ticket.status) {
      case 'New':
        newStat++
        break;
      case 'Open':
        open++
        break;
      case 'In Progress':
        in_progress++
        break;
      case 'Resolved':
        resolved++
        break;
      case 'More Info Required':
        more_info++
        break;
      default:
        break;
    }
  })

  const ctx = document.getElementById('ticketStatusChart')
  let ticketStatusChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['New', 'Open', 'In progress', 'Resolved', 'More Info Required'],
      // data: [newStat, open, in_progress, resolved, more_info],
      datasets: [{
        label: 'Ticket Status',
        data: [newStat, open, in_progress, resolved, more_info],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(154, 18, 179, 0.2)',

        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(154, 18, 179, 1)',
        ],
        borderWidth: 1
      }],
    },
    options: {
      maintainAspectRatio: false,
    }
  })
}

//call the charts here
ticketPriority()
ticketType()
ticketStatus()