const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  // Profile image optimization
  profile: {
    input: 'assets/images/Prfl.png',
    output: 'assets/images/Prfl_optimized.png',
    width: 800,
    height: 800,
    quality: 85
  },
  // Portfolio images optimization
  portfolio: {
    inputDir: 'assets/images/portfolio',
    outputDir: 'assets/images/portfolio_optimized',
    maxWidth: 600,
    quality: 80
  }
};

async function optimizeProfileImage() {
  try {
    await sharp(config.profile.input)
      .resize(config.profile.width, config.profile.height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .png({ quality: config.profile.quality, progressive: true })
      .toFile(config.profile.output);
    
    const originalSize = fs.statSync(config.profile.input).size;
    const optimizedSize = fs.statSync(config.profile.output).size;
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`Profile image optimized:`);
    console.log(`Original: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Optimized: ${(optimizedSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Size reduction: ${savings}%`);
  } catch (error) {
    console.error('Error optimizing profile image:', error);
  }
}

async function optimizePortfolioImages() {
  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(config.portfolio.outputDir)) {
      fs.mkdirSync(config.portfolio.outputDir, { recursive: true });
    }

    const files = fs.readdirSync(config.portfolio.inputDir);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png)$/i.test(file)
    );

    console.log(`Found ${imageFiles.length} portfolio images to optimize...`);

    for (const file of imageFiles) {
      const inputPath = path.join(config.portfolio.inputDir, file);
      const outputPath = path.join(config.portfolio.outputDir, file);
      
      try {
        await sharp(inputPath)
          .resize(config.portfolio.maxWidth, null, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: config.portfolio.quality, progressive: true })
          .toFile(outputPath);
        
        const originalSize = fs.statSync(inputPath).size;
        const optimizedSize = fs.statSync(outputPath).size;
        const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
        
        console.log(`${file}: ${(originalSize / 1024).toFixed(0)}KB → ${(optimizedSize / 1024).toFixed(0)}KB (${savings}% reduction)`);
      } catch (error) {
        console.error(`Error optimizing ${file}:`, error);
      }
    }
  } catch (error) {
    console.error('Error processing portfolio images:', error);
  }
}

async function main() {
  console.log('Starting image optimization...\n');
  
  await optimizeProfileImage();
  console.log('\n');
  
  await optimizePortfolioImages();
  
  console.log('\nOptimization complete!');
  console.log('\nNext steps:');
  console.log('1. Replace Prfl.png with Prfl_optimized.png');
  console.log('2. Replace portfolio images with optimized versions');
  console.log('3. Update HTML to reference optimized images');
}

main().catch(console.error);
