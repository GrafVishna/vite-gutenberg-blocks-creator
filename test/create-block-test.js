import { execSync, spawn } from 'child_process'
import { existsSync, mkdirSync, rmSync } from 'fs'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const testDir = join(__dirname, 'test-project')
const packagePath = resolve(__dirname, '..')
const createBlockScript = join(packagePath, 'bin', 'createBlock.js')

// Function to clean up test directory
function cleanupTestDir() {
   if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true })
   }
   mkdirSync(testDir)
}

// Function to test block creation
async function testBlockCreation(customDir = null) {
   console.log(`\nTesting block creation${customDir ? ` in directory "${customDir}"` : ''}...`)

   try {
      // Create test directory
      cleanupTestDir()

      // Change to test directory
      process.chdir(testDir)
      console.log('Current directory:', process.cwd())

      // Initialize npm project
      execSync('npm init -y', { stdio: 'ignore' })

      // Install local package
      const installCommand = `npm install file:${packagePath}`
      console.log('Installing package:', installCommand)
      execSync(installCommand, { stdio: 'inherit' })

      // Create block
      const args = customDir ? [createBlockScript, customDir] : [createBlockScript]
      console.log('Executing command:', 'node', args.join(' '))

      const createBlock = spawn('node', args, {
         stdio: ['pipe', 'inherit', 'inherit']
      })

      // Send answers to questions with delay
      const answers = ['test-company\n', 'test-namespace\n', 'test-block\n']
      let currentAnswer = 0

      const sendNextAnswer = () => {
         if (currentAnswer < answers.length) {
            createBlock.stdin.write(answers[currentAnswer])
            currentAnswer++
            setTimeout(sendNextAnswer, 500)
         }
      }

      // Start sending answers
      setTimeout(sendNextAnswer, 500)

      // Wait for process completion with timeout
      await Promise.race([
         new Promise((resolve, reject) => {
            createBlock.on('close', (code) => {
               if (code === 0) {
                  resolve()
               } else {
                  reject(new Error(`Process exited with code ${code}`))
               }
            })

            createBlock.on('error', (error) => {
               reject(error)
            })
         }),
         new Promise((_, reject) => setTimeout(() => {
            createBlock.kill()
            reject(new Error('Timeout: Process took too long to complete'))
         }, 10000))
      ])

      // Check if block was created
      const blockDir = customDir
         ? join(testDir, customDir, 'test-block')
         : join(testDir, 'BLOCKS', 'test-block')

      console.log('Checking directory:', blockDir)
      if (!existsSync(blockDir)) {
         throw new Error(`Block was not created in directory ${blockDir}`)
      }

      // Check for required files
      const requiredFiles = [
         'src/index.jsx',
         'src/edit.jsx',
         'src/save.jsx',
         'src/block.json',
         'package.json'
      ]

      for (const file of requiredFiles) {
         const filePath = join(blockDir, file)
         console.log('Checking file:', filePath)
         if (!existsSync(filePath)) {
            throw new Error(`File ${file} was not created`)
         }
      }

      console.log('✅ Test passed successfully!')
      return true

   } catch (error) {
      console.error('❌ Error during testing:', error.message)
      if (error.stdout) console.log('stdout output:', error.stdout.toString())
      if (error.stderr) console.log('stderr output:', error.stderr.toString())
      return false
   }
}

// Run tests
(async () => {
   console.log('Starting tests...')

   // Test 1: Create block in standard directory
   const test1Result = await testBlockCreation()

   // Test 2: Create block in custom directory
   const test2Result = await testBlockCreation('custom-blocks/blocks')

   // Print results
   console.log('\nTest results:')
   console.log(`Test 1 (standard directory): ${test1Result ? '✅' : '❌'}`)
   console.log(`Test 2 (custom directory): ${test2Result ? '✅' : '❌'}`)

   console.log('\nTest blocks are saved in directory:', testDir)
})()