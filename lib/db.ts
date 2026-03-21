import Database from "better-sqlite3"
import path from "path"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

const DB_PATH = path.join(process.cwd(), "data", "wepet.db")

let db: Database.Database | null = null

function getDb(): Database.Database {
  if (!db) {
    // Ensure directory exists
    const fs = require("fs")
    const dir = path.dirname(DB_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    db = new Database(DB_PATH)
    db.pragma("journal_mode = WAL")

    // Create tables
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        pet_name TEXT DEFAULT '',
        pet_breed TEXT DEFAULT '',
        pet_age TEXT DEFAULT '',
        pet_bio TEXT DEFAULT '',
        avatar_url TEXT DEFAULT '/golden-retriever.png',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `)
  }
  return db
}

export interface User {
  id: string
  email: string
  username: string
  password_hash: string
  pet_name: string
  pet_breed: string
  pet_age: string
  pet_bio: string
  avatar_url: string
  created_at: string
  updated_at: string
}

export interface UserPublic {
  id: string
  email: string
  username: string
  pet_name: string
  pet_breed: string
  pet_age: string
  pet_bio: string
  avatar_url: string
  created_at: string
}

export function createUser(
  email: string,
  username: string,
  password: string,
  petName: string = "",
  petBreed: string = "",
  petAge: string = "",
  petBio: string = ""
): UserPublic {
  const database = getDb()
  const id = uuidv4()
  const passwordHash = bcrypt.hashSync(password, 10)

  const stmt = database.prepare(`
    INSERT INTO users (id, email, username, password_hash, pet_name, pet_breed, pet_age, pet_bio)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  stmt.run(id, email.toLowerCase(), username, passwordHash, petName, petBreed, petAge, petBio)

  return {
    id,
    email: email.toLowerCase(),
    username,
    pet_name: petName,
    pet_breed: petBreed,
    pet_age: petAge,
    pet_bio: petBio,
    avatar_url: "/golden-retriever.png",
    created_at: new Date().toISOString(),
  }
}

export function authenticateUser(email: string, password: string): UserPublic | null {
  const database = getDb()
  const user = database
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.toLowerCase()) as User | undefined

  if (!user) return null
  if (!bcrypt.compareSync(password, user.password_hash)) return null

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    pet_name: user.pet_name,
    pet_breed: user.pet_breed,
    pet_age: user.pet_age,
    pet_bio: user.pet_bio,
    avatar_url: user.avatar_url,
    created_at: user.created_at,
  }
}

export function createSession(userId: string): string {
  const database = getDb()
  const sessionId = uuidv4()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days

  database
    .prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)")
    .run(sessionId, userId, expiresAt)

  return sessionId
}

export function getSessionUser(sessionId: string): UserPublic | null {
  const database = getDb()
  const row = database
    .prepare(
      `SELECT u.id, u.email, u.username, u.pet_name, u.pet_breed, u.pet_age, u.pet_bio, u.avatar_url, u.created_at
       FROM sessions s JOIN users u ON s.user_id = u.id
       WHERE s.id = ? AND s.expires_at > datetime('now')`
    )
    .get(sessionId) as UserPublic | undefined

  return row || null
}

export function deleteSession(sessionId: string): void {
  const database = getDb()
  database.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId)
}

export function updateUserProfile(
  userId: string,
  data: { pet_name?: string; pet_breed?: string; pet_age?: string; pet_bio?: string; username?: string }
): UserPublic | null {
  const database = getDb()
  const fields: string[] = []
  const values: string[] = []

  if (data.pet_name !== undefined) { fields.push("pet_name = ?"); values.push(data.pet_name) }
  if (data.pet_breed !== undefined) { fields.push("pet_breed = ?"); values.push(data.pet_breed) }
  if (data.pet_age !== undefined) { fields.push("pet_age = ?"); values.push(data.pet_age) }
  if (data.pet_bio !== undefined) { fields.push("pet_bio = ?"); values.push(data.pet_bio) }
  if (data.username !== undefined) { fields.push("username = ?"); values.push(data.username) }

  if (fields.length === 0) return null

  fields.push("updated_at = datetime('now')")
  values.push(userId)

  database.prepare(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`).run(...values)

  const user = database
    .prepare("SELECT id, email, username, pet_name, pet_breed, pet_age, pet_bio, avatar_url, created_at FROM users WHERE id = ?")
    .get(userId) as UserPublic | undefined

  return user || null
}

export function getUserCount(): number {
  const database = getDb()
  const row = database.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number }
  return row.count
}

export function getAllUsers(): UserPublic[] {
  const database = getDb()
  return database
    .prepare("SELECT id, email, username, pet_name, pet_breed, pet_age, pet_bio, avatar_url, created_at FROM users ORDER BY created_at DESC")
    .all() as UserPublic[]
}
