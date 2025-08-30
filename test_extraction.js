// Simulate the extractStructuredData function to debug
function extractStructuredData(query, userLocation = null) {
    console.log('🔍 Extracting from query:', query);
    
    // Extract service - be more flexible and dynamic
    let service = '';
    
    // Modern service extraction with intelligent cleaning
    const servicePatterns = [
      // Pattern 1: Full query with location
      { 
        regex: /(?:i\s+)?(?:need|want|looking for|find|get me|hire|book)\s+(?:a|an)?\s*(?:local\s+)?([^in]+?)\s+(?:in|near|close to|at|around)\s+(.+?)(?:\.|$|please|specifically)/i,
        serviceGroup: 1,
        locationGroup: 2,
        desc: 'full query with location'
      },
      // Pattern 2: Casual language with hesitation words
      {
        regex: /(?:umm|uh|well|actually|so)?\s*(?:i\s+)?(?:need|want|looking for|require)\s+(?:a|an)?\s*([a-zA-Z\s]+?)(?:\s*$|\s+in|\s+near|\s+close|\s+around)/i,
        serviceGroup: 1,
        locationGroup: null,
        desc: 'casual language with hesitation'
      },
      // Pattern 3: Direct service mention
      {
        regex: /(?:i\s+)?(?:need|want|looking for|find|get me|hire|book)\s+(?:a|an)?\s*(?:local\s+)?([^.]+?)(?:\s+(?:in|near|close to|at|around)|$)/i,
        serviceGroup: 1,
        locationGroup: null,
        desc: 'service with potential location'
      },
      // Pattern 4: Simple service request
      {
        regex: /^(?:umm|uh|well)?\s*(?:i\s+)?(?:need|want|require)\s+(?:a|an)?\s*([a-zA-Z]+)(?:\s*$)/i,
        serviceGroup: 1,
        locationGroup: null,
        desc: 'simple service request'
      }
    ];
    
    let patternMatched = false;
    for (const pattern of servicePatterns) {
      const match = query.match(pattern.regex);
      if (match && match[pattern.serviceGroup]) {
        service = match[pattern.serviceGroup].trim();
        
        // Intelligent service cleaning - remove common noise words
        service = service.replace(/\b(local|some|good|best|reliable|professional)\b/gi, '').trim();
        
        console.log(`✅ Extracted service via ${pattern.desc}:`, service);
        patternMatched = true;
        break;
      }
    }
    
    // Smart location extraction with multiple modern patterns
    let location = '';
    
    // First check if we already extracted location from service pattern
    const serviceWithLocationPattern = servicePatterns[0]; // Full query with location
    const serviceLocationMatch = query.match(serviceWithLocationPattern.regex);
    if (serviceLocationMatch && serviceLocationMatch[2]) {
      location = serviceLocationMatch[2].trim();
      console.log('✅ Extracted location via service pattern:', location);
    } else {
      // Modern location patterns - prioritized by specificity
      const locationPatterns = [
        // Pattern 1: "near [specific location]"
        { regex: /near\s+([^.]+?)(?:\s*$|\.|\,|please)/i, desc: 'near location' },
        // Pattern 2: "close to [location]"
        { regex: /close\s+to\s+([^.]+?)(?:\s*$|\.|\,|please)/i, desc: 'close to location' },
        // Pattern 3: "around [location]"
        { regex: /around\s+([^.]+?)(?:\s*$|\.|\,|please)/i, desc: 'around location' },
        // Pattern 4: "at [location]"
        { regex: /at\s+([^.]+?)(?:\s*$|\.|\,|please)/i, desc: 'at location' },
        // Pattern 5: "in [location]"
        { regex: /in\s+([^.]+?)(?:\s*$|\.|\,|please|specifically)/i, desc: 'in location' },
        // Pattern 6: "near me" or similar self-referential
        { regex: /(near me|close to me|around me|my area|here)/i, desc: 'near me' }
      ];
      
      for (const pattern of locationPatterns) {
        const match = query.match(pattern.regex);
        if (match && match[1]) {
          location = match[1].trim();
          console.log(`✅ Extracted location via ${pattern.desc}:`, location);
          break;
        } else if (pattern.desc === 'near me' && match) {
          location = 'near me';
          console.log(`✅ Extracted location: ${match[0]}`);
          break;
        }
      }
    }
    
    // Post-process location to handle context-specific terms
    if (location === 'my area' || location === 'near me') {
      // Replace with actual user location if available
      console.log('🔍 Processing "near me" - userLocation:', userLocation);
      if (userLocation) {
        const locationParts = [];
        if (userLocation.area) locationParts.push(userLocation.area);
        if (userLocation.city && userLocation.city !== userLocation.area) locationParts.push(userLocation.city);
        if (userLocation.state) locationParts.push(userLocation.state);
        if (userLocation.country && userLocation.country !== 'unknown') locationParts.push(userLocation.country);
        location = locationParts.join(', ');
        console.log('✅ Replaced "near me" with actual location:', location);
      } else {
        console.log('⚠️ "near me" detected but no userLocation available');
      }
    }
    
    // Additional fallback: If no location found but userLocation exists, use it
    // This handles cases where user has provided location earlier (via "near me" etc) and now asks for a service
    if (!location && userLocation) {
      const locationParts = [];
      if (userLocation.area) locationParts.push(userLocation.area);
      if (userLocation.city && userLocation.city !== userLocation.area) locationParts.push(userLocation.city);
      if (userLocation.state) locationParts.push(userLocation.state);
      if (userLocation.country && userLocation.country !== 'unknown') locationParts.push(userLocation.country);
      location = locationParts.join(', ');
      console.log('🔄 Fallback: Used userLocation as location context:', location);
    }
    
    console.log('🎯 Final extraction:', { service, location });
    return { service, location };
}

// Test scenarios
const userLocation = {
    area: "Mozang",
    city: "Lahore", 
    state: "Punjab",
    country: "Pakistan"
};

console.log("=== Test 1: Full query with location ===");
extractStructuredData("I need a plumber in Mozang, Lahore");

console.log("\n=== Test 2: Casual language with userLocation ===");
extractStructuredData("umm i need plumber", userLocation);

console.log("\n=== Test 3: Casual language without userLocation ===");
extractStructuredData("umm i need plumber");

console.log("\n=== Test 4: Other casual variations ===");
extractStructuredData("i need plumber", userLocation);
extractStructuredData("uh i need a plumber", userLocation);
extractStructuredData("well i need plumber service", userLocation);