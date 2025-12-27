require('dotenv').config();
const mongoose = require('mongoose');
const { Pool } = require('pg');
const Assignment = require('../models/Assignment');

const MONGODB_URI = process.env.MONGODB_URI;

const pgPool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

// Sample assignments with pre-configured data
const assignments = [
  {
    title: 'Select All Employees',
    description: 'Learn the basics of SELECT statement',
    difficulty: 'Easy',
    question: 'Write a query to retrieve all employee records from the employees table.',
    requirements: [
      'Select all columns',
      'No filtering required',
    ],
    tableSchemas: [
      {
        tableName: 'employees',
        columns: [
          { name: 'id', type: 'INTEGER', description: 'Employee ID' },
          { name: 'name', type: 'VARCHAR(100)', description: 'Employee name' },
          { name: 'department', type: 'VARCHAR(50)', description: 'Department name' },
          { name: 'salary', type: 'DECIMAL(10,2)', description: 'Annual salary' },
        ],
        sampleData: [
          { id: 1, name: 'Alice Johnson', department: 'Engineering', salary: 75000 },
          { id: 2, name: 'Bob Smith', department: 'Marketing', salary: 65000 },
          { id: 3, name: 'Carol White', department: 'Engineering', salary: 80000 },
          { id: 4, name: 'David Brown', department: 'Sales', salary: 60000 },
        ],
      },
    ],
    expectedOutput: 'All employee records',
    hints: ['Think about the basic SELECT syntax', 'Use * to select all columns'],
    tags: ['beginner', 'select', 'basics'],
  },
  {
    title: 'Filter High Salary Employees',
    description: 'Practice using WHERE clause with conditions',
    difficulty: 'Easy',
    question: 'Find all employees whose salary is greater than $70,000.',
    requirements: [
      'Filter by salary condition',
      'Return all columns',
    ],
    tableSchemas: [
      {
        tableName: 'employees',
        columns: [
          { name: 'id', type: 'INTEGER', description: 'Employee ID' },
          { name: 'name', type: 'VARCHAR(100)', description: 'Employee name' },
          { name: 'department', type: 'VARCHAR(50)', description: 'Department name' },
          { name: 'salary', type: 'DECIMAL(10,2)', description: 'Annual salary' },
        ],
        sampleData: [
          { id: 1, name: 'Alice Johnson', department: 'Engineering', salary: 75000 },
          { id: 2, name: 'Bob Smith', department: 'Marketing', salary: 65000 },
          { id: 3, name: 'Carol White', department: 'Engineering', salary: 80000 },
          { id: 4, name: 'David Brown', department: 'Sales', salary: 60000 },
        ],
      },
    ],
    expectedOutput: 'Employees with salary > 70000',
    hints: ['Use WHERE clause', 'Comparison operator > for greater than'],
    tags: ['beginner', 'where', 'filtering'],
  },
  {
    title: 'Count Employees by Department',
    description: 'Learn aggregate functions and GROUP BY',
    difficulty: 'Medium',
    question: 'Count the number of employees in each department.',
    requirements: [
      'Group by department',
      'Show department name and count',
      'Use aggregate function',
    ],
    tableSchemas: [
      {
        tableName: 'employees',
        columns: [
          { name: 'id', type: 'INTEGER', description: 'Employee ID' },
          { name: 'name', type: 'VARCHAR(100)', description: 'Employee name' },
          { name: 'department', type: 'VARCHAR(50)', description: 'Department name' },
          { name: 'salary', type: 'DECIMAL(10,2)', description: 'Annual salary' },
        ],
        sampleData: [
          { id: 1, name: 'Alice Johnson', department: 'Engineering', salary: 75000 },
          { id: 2, name: 'Bob Smith', department: 'Marketing', salary: 65000 },
          { id: 3, name: 'Carol White', department: 'Engineering', salary: 80000 },
          { id: 4, name: 'David Brown', department: 'Sales', salary: 60000 },
          { id: 5, name: 'Eve Davis', department: 'Engineering', salary: 72000 },
        ],
      },
    ],
    expectedOutput: 'Department counts',
    hints: ['Use COUNT() function', 'GROUP BY department', 'Give the count column an alias'],
    tags: ['intermediate', 'aggregate', 'group-by'],
  },
  {
    title: 'Join Orders with Customers',
    description: 'Practice INNER JOIN between two tables',
    difficulty: 'Medium',
    question: 'Retrieve all orders along with customer names who placed them.',
    requirements: [
      'Join orders and customers tables',
      'Show order_id, customer_name, and order_date',
      'Use INNER JOIN',
    ],
    tableSchemas: [
      {
        tableName: 'customers',
        columns: [
          { name: 'customer_id', type: 'INTEGER', description: 'Customer ID' },
          { name: 'customer_name', type: 'VARCHAR(100)', description: 'Customer name' },
          { name: 'email', type: 'VARCHAR(100)', description: 'Email address' },
        ],
        sampleData: [
          { customer_id: 1, customer_name: 'John Doe', email: 'john@example.com' },
          { customer_id: 2, customer_name: 'Jane Smith', email: 'jane@example.com' },
          { customer_id: 3, customer_name: 'Mike Wilson', email: 'mike@example.com' },
        ],
      },
      {
        tableName: 'orders',
        columns: [
          { name: 'order_id', type: 'INTEGER', description: 'Order ID' },
          { name: 'customer_id', type: 'INTEGER', description: 'Customer ID (foreign key)' },
          { name: 'order_date', type: 'DATE', description: 'Order date' },
          { name: 'total_amount', type: 'DECIMAL(10,2)', description: 'Total amount' },
        ],
        sampleData: [
          { order_id: 101, customer_id: 1, order_date: '2025-01-15', total_amount: 250.50 },
          { order_id: 102, customer_id: 2, order_date: '2025-01-16', total_amount: 180.00 },
          { order_id: 103, customer_id: 1, order_date: '2025-01-17', total_amount: 320.75 },
        ],
      },
    ],
    expectedOutput: 'Orders with customer information',
    hints: ['INNER JOIN links two tables', 'Match on customer_id', 'Select columns from both tables'],
    tags: ['intermediate', 'join', 'relationships'],
  },
  {
    title: 'Find Top 3 Highest Paid Employees',
    description: 'Use ORDER BY and LIMIT clauses',
    difficulty: 'Medium',
    question: 'Retrieve the top 3 highest-paid employees.',
    requirements: [
      'Sort by salary in descending order',
      'Limit results to 3 rows',
      'Show name, department, and salary',
    ],
    tableSchemas: [
      {
        tableName: 'employees',
        columns: [
          { name: 'id', type: 'INTEGER', description: 'Employee ID' },
          { name: 'name', type: 'VARCHAR(100)', description: 'Employee name' },
          { name: 'department', type: 'VARCHAR(50)', description: 'Department name' },
          { name: 'salary', type: 'DECIMAL(10,2)', description: 'Annual salary' },
        ],
        sampleData: [
          { id: 1, name: 'Alice Johnson', department: 'Engineering', salary: 75000 },
          { id: 2, name: 'Bob Smith', department: 'Marketing', salary: 65000 },
          { id: 3, name: 'Carol White', department: 'Engineering', salary: 80000 },
          { id: 4, name: 'David Brown', department: 'Sales', salary: 60000 },
          { id: 5, name: 'Eve Davis', department: 'Engineering', salary: 72000 },
          { id: 6, name: 'Frank Miller', department: 'Executive', salary: 120000 },
        ],
      },
    ],
    expectedOutput: 'Top 3 employees by salary',
    hints: ['ORDER BY salary DESC', 'LIMIT restricts number of rows', 'DESC means descending'],
    tags: ['intermediate', 'sorting', 'limit'],
  },
];

// PostgreSQL table creation queries
const createTablesSQL = `
-- Drop existing tables
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS employees CASCADE;

-- Create employees table
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(50) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL
);

-- Create customers table
CREATE TABLE customers (
  customer_id SERIAL PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

-- Create orders table
CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(customer_id),
  order_date DATE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL
);

-- Insert sample data into employees
INSERT INTO employees (name, department, salary) VALUES
  ('Alice Johnson', 'Engineering', 75000),
  ('Bob Smith', 'Marketing', 65000),
  ('Carol White', 'Engineering', 80000),
  ('David Brown', 'Sales', 60000),
  ('Eve Davis', 'Engineering', 72000),
  ('Frank Miller', 'Executive', 120000);

-- Insert sample data into customers
INSERT INTO customers (customer_name, email) VALUES
  ('John Doe', 'john@example.com'),
  ('Jane Smith', 'jane@example.com'),
  ('Mike Wilson', 'mike@example.com');

-- Insert sample data into orders
INSERT INTO orders (customer_id, order_date, total_amount) VALUES
  (1, '2025-01-15', 250.50),
  (2, '2025-01-16', 180.00),
  (1, '2025-01-17', 320.75);
`;

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing assignments
    await Assignment.deleteMany({});
    console.log('🗑️  Cleared existing assignments');

    // Insert sample assignments
    await Assignment.insertMany(assignments);
    console.log(`✅ Inserted ${assignments.length} assignments into MongoDB`);

    // Setup PostgreSQL tables
    console.log('🐘 Setting up PostgreSQL tables...');
    await pgPool.query(createTablesSQL);
    console.log('✅ PostgreSQL tables created and populated');

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    await pgPool.end();
    process.exit(0);
  }
};

seedDatabase();
