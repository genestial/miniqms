/**
 * Test S3 Connection
 * Run this to verify your S3 storage is configured correctly
 * 
 * Usage: node test-s3.js
 */

require('dotenv').config();
const { S3Client, ListBucketsCommand, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT,
  credentials: process.env.AWS_ACCESS_KEY_ID ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

async function testConnection() {
  console.log('🔍 Testing S3 Connection...\n');
  
  // Check environment variables
  console.log('Configuration:');
  console.log(`  Region: ${process.env.AWS_REGION || 'us-east-1'}`);
  console.log(`  Endpoint: ${process.env.S3_ENDPOINT || '(AWS default)'}`);
  console.log(`  Bucket: ${process.env.S3_BUCKET_NAME || 'NOT SET'}`);
  console.log(`  Access Key: ${process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing'}`);
  console.log(`  Secret Key: ${process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing'}\n`);

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('❌ Missing AWS credentials in .env file!');
    console.error('   Please add AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to your .env file.');
    process.exit(1);
  }

  if (!process.env.S3_BUCKET_NAME) {
    console.error('❌ Missing S3_BUCKET_NAME in .env file!');
    process.exit(1);
  }

  try {
    // Test 1: List buckets
    console.log('Test 1: Listing buckets...');
    const listCommand = new ListBucketsCommand({});
    const listResponse = await s3Client.send(listCommand);
    console.log('✅ Connection successful!');
    console.log(`   Found ${listResponse.Buckets?.length || 0} bucket(s):`);
    listResponse.Buckets?.forEach(bucket => {
      console.log(`   - ${bucket.Name} (created: ${bucket.CreationDate})`);
    });

    // Test 2: Check if our bucket exists
    console.log(`\nTest 2: Checking if bucket "${process.env.S3_BUCKET_NAME}" exists...`);
    const bucketExists = listResponse.Buckets?.some(
      b => b.Name === process.env.S3_BUCKET_NAME
    );
    
    if (bucketExists) {
      console.log(`✅ Bucket "${process.env.S3_BUCKET_NAME}" found!`);
    } else {
      console.log(`⚠️  Bucket "${process.env.S3_BUCKET_NAME}" not found!`);
      console.log(`   Please create this bucket in your S3 service.`);
    }

    // Test 3: Try to write a test file
    console.log(`\nTest 3: Testing write access...`);
    const testKey = `test/connection-test-${Date.now()}.txt`;
    const putCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: testKey,
      Body: 'This is a test file from Mini QMS setup',
      ContentType: 'text/plain',
    });
    
    await s3Client.send(putCommand);
    console.log(`✅ Write test successful!`);
    console.log(`   Test file created: ${testKey}`);

    console.log('\n🎉 All tests passed! Your S3 storage is configured correctly.');
    console.log('\nYou can now continue with the database setup.');

  } catch (error) {
    console.error('\n❌ Connection test failed!');
    console.error(`   Error: ${error.message}`);
    
    if (error.message.includes('InvalidAccessKeyId')) {
      console.error('\n💡 Tip: Check your AWS_ACCESS_KEY_ID in .env file');
    } else if (error.message.includes('SignatureDoesNotMatch')) {
      console.error('\n💡 Tip: Check your AWS_SECRET_ACCESS_KEY in .env file');
    } else if (error.message.includes('NoSuchBucket')) {
      console.error(`\n💡 Tip: Bucket "${process.env.S3_BUCKET_NAME}" doesn't exist. Create it first.`);
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('timeout')) {
      console.error('\n💡 Tip: For MinIO, make sure the server is running on the endpoint URL');
      console.error('   For AWS, check your internet connection');
    }
    
    process.exit(1);
  }
}

testConnection();
