#!/usr/bin/env node

/**
 * Generate a secure random secret for NEXTAUTH_SECRET
 */
const crypto = require('crypto')

const secret = crypto.randomBytes(32).toString('base64')
console.log('\nGenerated NEXTAUTH_SECRET:')
console.log(secret)
console.log('\nAdd this to your .env file as:')
console.log(`NEXTAUTH_SECRET="${secret}"\n`)
