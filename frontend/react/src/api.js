import {Router} from "express";
import StatusCodes from "http-status-codes";
import {tickets as ticketsDb, accounts as accountsDb} from './db.js';

export const router = Router()
const {OK, FORBIDDEN} = StatusCodes

/* Resolve a ticket. */
router.post('/tickets/:id/resolve', async (req, res) => {
  const ticket = ticketsDb[req.auth.tenant][req.params.id]
  ticket.resolved = req.body.resolved ? true : false
  ticket.last_updated = now()
  return res.status(OK).json(asTicket(req.params.id, ticket))
})

/* Create tickets. */
router.post('/tickets', async (req, res) => {
  const id = ticketsDb[req.auth.tenant].length
  const ticket = req.body
  ticket.last_updated = now()
  ticketsDb[req.auth.tenant].push(ticket)
  return res.status(OK).json(asTicket(id, ticket))
})

/* List all tickets. */
router.get('/tickets', async (req, res) => {
  const tickets = ticketsDb[req.auth.tenant]
    .map((t, index) => asTicket(index, t))
  return res.status(OK).json({tickets})
})

/* Get a ticket. */
router.get('/tickets/:id', async (req, res) => {
  const ticket = ticketsDb[req.auth.tenant][req.params.id]
  return res.status(OK).json(asTicket(req.params.id, ticket))
})

function now() {
  return new Date().toISOString().split('.')[0] + 'Z'
}

function asTicket(id, attrs) {
  return {id, ...attrs}
}