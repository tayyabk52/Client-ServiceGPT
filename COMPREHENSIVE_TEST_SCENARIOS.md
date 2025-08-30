# Comprehensive Test Scenarios for ServiceGPT Chat Interface

## Test Categories

### 1. Location-Based Scenarios

#### 1.1 Direct Location Selection
- [ ] **T001**: Click "Near me" → Detect location → Should show "Great! I found you're in [Location]. What service do you need?"
- [ ] **T002**: Click "Near me" → Location denied → Should show "Location access was denied. You can click 'Near Me' again..."
- [ ] **T003**: Click predefined location (e.g., "New York") → Should ask for service
- [ ] **T004**: Click "Near me" with no service selected → Should detect location and ask for service
- [ ] **T005**: Click "Near me" with service already selected → Should auto-search with detected location

#### 1.2 Text-Based Location Input
- [ ] **T006**: Type "near me" → Should detect location
- [ ] **T007**: Type "in Chicago" → Should set location to Chicago
- [ ] **T008**: Type "close to Manhattan" → Should extract Manhattan as location
- [ ] **T009**: Type "around Los Angeles" → Should extract Los Angeles as location
- [ ] **T010**: Type "at downtown" → Should extract downtown as location

#### 1.3 Location Context Preservation
- [ ] **T011**: Click "Near me" → Detect location → Type service → Should preserve location
- [ ] **T012**: Select location → Type service → Should preserve location
- [ ] **T013**: Complete search → Type new service → Should preserve previous location context
- [ ] **T014**: Type "I need plumber" after location detected → Should use detected location
- [ ] **T015**: Type "umm i need electrician" after location detected → Should use detected location

### 2. Service-Based Scenarios

#### 2.1 Direct Service Selection
- [ ] **T016**: Click service card (e.g., "Plumber") → Should ask for location
- [ ] **T017**: Click service card with location detected → Should auto-search
- [ ] **T018**: Click service card with location selected → Should auto-search
- [ ] **T019**: Click multiple service cards in sequence → Should update service selection

#### 2.2 Text-Based Service Input
- [ ] **T020**: Type "I need a plumber" → Should extract "plumber" as service
- [ ] **T021**: Type "find an electrician" → Should extract "electrician" as service  
- [ ] **T022**: Type "looking for mechanic" → Should extract "mechanic" as service
- [ ] **T023**: Type "get me a cleaner" → Should extract "cleaner" as service
- [ ] **T024**: Type "hire a handyman" → Should extract "handyman" as service
- [ ] **T025**: Type "book a carpenter" → Should extract "carpenter" as service

#### 2.3 Service Context Variations
- [ ] **T026**: Type "plumber" (single word) → Should extract as service
- [ ] **T027**: Type "i need plumber" (no article) → Should extract "plumber" as service
- [ ] **T028**: Type "umm i need plumber" (with hesitation) → Should extract "plumber" as service
- [ ] **T029**: Type "local plumber" → Should extract "plumber" as service, ignore "local"
- [ ] **T030**: Type "good electrician" → Should extract "electrician" as service, ignore "good"

### 3. Combined Service + Location Scenarios

#### 3.1 Structured Queries (for /api/chat)
- [ ] **T031**: "I need a plumber in Chicago" → Should use /api/chat endpoint
- [ ] **T032**: "Find an electrician near me" with detected location → Should use /api/chat endpoint
- [ ] **T033**: "Looking for mechanic in Los Angeles" → Should use /api/chat endpoint
- [ ] **T034**: "Get me a cleaner close to Manhattan" → Should use /api/chat endpoint
- [ ] **T035**: "Hire a handyman around downtown" → Should use /api/chat endpoint

#### 3.2 Natural Language Queries (for /api/nlp)
- [ ] **T036**: "I need someone to fix my sink" → Should use /api/nlp endpoint
- [ ] **T037**: "My car is broken, who can help?" → Should use /api/nlp endpoint
- [ ] **T038**: "Kitchen renovation needed" → Should use /api/nlp endpoint
- [ ] **T039**: "House cleaning service required" → Should use /api/nlp endpoint
- [ ] **T040**: "Emergency plumbing help" → Should use /api/nlp endpoint

### 4. Conversation Flow Scenarios

#### 4.1 Sequential Interactions
- [ ] **T041**: Service first → Location second → Search
- [ ] **T042**: Location first → Service second → Search  
- [ ] **T043**: Partial query → Clarification → Complete search
- [ ] **T044**: Invalid query → Retry with valid query → Search
- [ ] **T045**: Successful search → New search with different service

#### 4.2 Context Switching
- [ ] **T046**: Search plumber → Switch to electrician → Should preserve location
- [ ] **T047**: Search in Chicago → Switch to New York → Should preserve service
- [ ] **T048**: Complete search → Start new search → Should show quick replies
- [ ] **T049**: Mid-conversation → Click "Near me" → Should update location context
- [ ] **T050**: Service selected → Change location → Should use new location

### 5. International Location Scenarios

#### 5.1 Pakistani Locations
- [ ] **T051**: "I need plumber in Lahore" → Should work with Pakistani location
- [ ] **T052**: "Find electrician in Karachi" → Should work with Pakistani location
- [ ] **T053**: "Mechanic in Islamabad" → Should work with Pakistani location
- [ ] **T054**: Detect location in Mozang, Lahore → Should use Pakistani context
- [ ] **T055**: "local plumber in Rawalpindi" → Should emphasize local search

#### 5.2 US Locations  
- [ ] **T056**: "I need plumber in Chicago" → Should work with US location
- [ ] **T057**: "Find electrician in Los Angeles" → Should work with US location
- [ ] **T058**: Detect location in New York → Should use US context

#### 5.3 International Context Handling
- [ ] **T059**: Pakistani location detected → Service request → Should add country context
- [ ] **T060**: Non-US location → Should add "Please find service providers specifically in [Country]"
- [ ] **T061**: Unknown country → Should handle gracefully

### 6. Error Handling & Edge Cases

#### 6.1 API Errors
- [ ] **T062**: Backend offline → Should show connection error message
- [ ] **T063**: Invalid API response → Should handle gracefully
- [ ] **T064**: Timeout → Should show appropriate message
- [ ] **T065**: Rate limiting → Should handle appropriately

#### 6.2 Location Detection Errors
- [ ] **T066**: Location permission denied → Should show fallback options
- [ ] **T067**: Location detection failed → Should ask for manual location
- [ ] **T068**: Invalid coordinates → Should handle gracefully
- [ ] **T069**: Network error during location detection → Should retry appropriately

#### 6.3 Invalid Input Handling
- [ ] **T070**: Empty input → Should not submit
- [ ] **T071**: Only special characters → Should show helpful message
- [ ] **T072**: Very long input → Should handle appropriately
- [ ] **T073**: Non-service related query → Should guide to service request
- [ ] **T074**: Ambiguous query → Should ask for clarification

### 7. UI/UX Scenarios

#### 7.1 Quick Reply Interactions
- [ ] **T075**: Service card click → Should hide quick replies
- [ ] **T076**: Location chip click → Should hide quick replies  
- [ ] **T077**: Text input → Should hide quick replies
- [ ] **T078**: Successful search → Should show quick replies again for new search
- [ ] **T079**: Error response → Should show quick replies

#### 7.2 Loading States
- [ ] **T080**: Location detection → Should show loading spinner
- [ ] **T081**: API request → Should show typing indicator with stages
- [ ] **T082**: Provider cards loading → Should show skeleton cards
- [ ] **T083**: Cancel during loading → Should handle gracefully

#### 7.3 Responsive Behavior
- [ ] **T084**: Mobile → Service cards should stack vertically
- [ ] **T085**: Desktop → Service cards should show horizontally
- [ ] **T086**: Mobile → Location chips should wrap properly
- [ ] **T087**: Desktop → Location chips should display inline

### 8. Backend Integration Scenarios

#### 8.1 API Endpoint Selection
- [ ] **T088**: Structured query with service + location → Should call /api/chat
- [ ] **T089**: Natural language query → Should call /api/nlp
- [ ] **T090**: Ambiguous query → Should route to appropriate endpoint
- [ ] **T091**: Service only → Should route to /api/nlp
- [ ] **T092**: Location only → Should handle appropriately

#### 8.2 Response Handling
- [ ] **T093**: Successful response with providers → Should display provider cards
- [ ] **T094**: No results found → Should show "no results" message
- [ ] **T095**: Invalid query response → Should show guidance message
- [ ] **T096**: Partial results → Should handle appropriately
- [ ] **T097**: Usage report → Should log usage data

### 9. Data Extraction & Processing

#### 9.1 Service Extraction
- [ ] **T098**: "I need a good reliable plumber" → Should extract "plumber"
- [ ] **T099**: "Find me the best local electrician" → Should extract "electrician"
- [ ] **T100**: "Looking for some mechanic" → Should extract "mechanic"
- [ ] **T101**: "professional cleaner needed" → Should extract "cleaner"

#### 9.2 Location Extraction
- [ ] **T102**: "near me" with detected location → Should use detected location
- [ ] **T103**: "in Chicago, IL" → Should extract "Chicago, IL"
- [ ] **T104**: "close to downtown Manhattan" → Should extract "downtown Manhattan"
- [ ] **T105**: "around the Los Angeles area" → Should extract "Los Angeles"

### 10. Performance & Reliability

#### 10.1 Response Times
- [ ] **T106**: Service selection → Should respond within 100ms
- [ ] **T107**: Location detection → Should complete within 5s
- [ ] **T108**: API request → Should respond within 10s
- [ ] **T109**: Error handling → Should respond immediately

#### 10.2 Memory & State Management
- [ ] **T110**: Multiple searches → Should not leak memory
- [ ] **T111**: State persistence → Should maintain state across interactions
- [ ] **T112**: Context switching → Should properly clean up previous state
- [ ] **T113**: Long session → Should remain responsive

## Test Results Matrix

| Test ID | Scenario | Status | Expected Result | Actual Result | Notes |
|---------|----------|--------|----------------|---------------|-------|
| T001    | Click "Near me" | ⏳ | Location detected | | |
| T002    | Location denied | ⏳ | Show fallback | | |
| ...     | ... | ... | ... | ... | ... |

## Test Execution Priority

### High Priority (Critical Flow)
- T001, T004, T011, T014, T015, T031, T032, T041, T042, T051, T054

### Medium Priority (Common Scenarios)  
- T016, T020-T030, T036-T040, T046-T050, T062-T069

### Low Priority (Edge Cases)
- T070-T074, T084-T087, T106-T113

## Issues Found

### Critical Issues
- [ ] Issue 1: Description
- [ ] Issue 2: Description

### Minor Issues  
- [ ] Issue 3: Description
- [ ] Issue 4: Description

## Recommendations

### Frontend Improvements Needed
1. 
2. 
3. 

### Backend Adjustments Required
1. 
2. 
3. 

## Test Environment
- Frontend: http://localhost:5175
- Backend: http://localhost:8000
- Date: 2025-08-30
- Tester: Claude Code