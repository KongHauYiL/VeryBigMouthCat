#!/usr/bin/env python3
"""
Backend API Testing Suite for BigMouthCat Tapping Game
Tests all implemented backend endpoints and MongoDB connectivity
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any
import sys

# Configuration
BACKEND_URL = "http://localhost:8001"  # From frontend/.env REACT_APP_BACKEND_URL
API_BASE = f"{BACKEND_URL}/api"

class BackendTester:
    def __init__(self):
        self.test_results = []
        self.session = requests.Session()
        
    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if response_data and not success:
            print(f"   Response: {response_data}")
        print()

    def test_server_connectivity(self):
        """Test if backend server is running and accessible"""
        try:
            response = self.session.get(f"{BACKEND_URL}/docs", timeout=5)
            if response.status_code == 200:
                self.log_test("Server Connectivity", True, "FastAPI docs accessible")
                return True
            else:
                self.log_test("Server Connectivity", False, f"Docs returned status {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("Server Connectivity", False, f"Connection failed: {str(e)}")
            return False

    def test_root_endpoint(self):
        """Test GET /api/ endpoint"""
        try:
            response = self.session.get(f"{API_BASE}/", timeout=5)
            if response.status_code == 200:
                data = response.json()
                if data.get("message") == "Hello World":
                    self.log_test("Root Endpoint (GET /api/)", True, "Returned expected hello world message")
                    return True
                else:
                    self.log_test("Root Endpoint (GET /api/)", False, "Unexpected response content", data)
                    return False
            else:
                self.log_test("Root Endpoint (GET /api/)", False, f"HTTP {response.status_code}", response.text)
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("Root Endpoint (GET /api/)", False, f"Request failed: {str(e)}")
            return False

    def test_status_post_endpoint(self):
        """Test POST /api/status endpoint"""
        test_data = {
            "client_name": "BigMouthCat_TestClient"
        }
        
        try:
            response = self.session.post(
                f"{API_BASE}/status", 
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=5
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["id", "client_name", "timestamp"]
                
                if all(field in data for field in required_fields):
                    if data["client_name"] == test_data["client_name"]:
                        self.log_test("Status POST Endpoint", True, f"Created status check with ID: {data['id']}")
                        return data  # Return the created object for further testing
                    else:
                        self.log_test("Status POST Endpoint", False, "Client name mismatch", data)
                        return None
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_test("Status POST Endpoint", False, f"Missing fields: {missing}", data)
                    return None
            else:
                self.log_test("Status POST Endpoint", False, f"HTTP {response.status_code}", response.text)
                return None
                
        except requests.exceptions.RequestException as e:
            self.log_test("Status POST Endpoint", False, f"Request failed: {str(e)}")
            return None

    def test_status_get_endpoint(self):
        """Test GET /api/status endpoint"""
        try:
            response = self.session.get(f"{API_BASE}/status", timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Status GET Endpoint", True, f"Retrieved {len(data)} status checks")
                    return data
                else:
                    self.log_test("Status GET Endpoint", False, "Response is not a list", data)
                    return None
            else:
                self.log_test("Status GET Endpoint", False, f"HTTP {response.status_code}", response.text)
                return None
                
        except requests.exceptions.RequestException as e:
            self.log_test("Status GET Endpoint", False, f"Request failed: {str(e)}")
            return None

    def test_mongodb_persistence(self):
        """Test MongoDB data persistence by creating and retrieving data"""
        # First, get initial count
        initial_data = self.test_status_get_endpoint()
        if initial_data is None:
            self.log_test("MongoDB Persistence", False, "Could not retrieve initial data")
            return False
            
        initial_count = len(initial_data)
        
        # Create a new status check
        created_status = self.test_status_post_endpoint()
        if created_status is None:
            self.log_test("MongoDB Persistence", False, "Could not create test data")
            return False
        
        # Wait a moment for database write
        time.sleep(0.5)
        
        # Retrieve data again
        updated_data = self.test_status_get_endpoint()
        if updated_data is None:
            self.log_test("MongoDB Persistence", False, "Could not retrieve updated data")
            return False
            
        updated_count = len(updated_data)
        
        # Check if the new item was persisted
        if updated_count == initial_count + 1:
            # Verify the created item is in the list
            found_item = None
            for item in updated_data:
                if item.get("id") == created_status["id"]:
                    found_item = item
                    break
                    
            if found_item:
                self.log_test("MongoDB Persistence", True, f"Data persisted correctly. Count: {initial_count} → {updated_count}")
                return True
            else:
                self.log_test("MongoDB Persistence", False, "Created item not found in retrieved data")
                return False
        else:
            self.log_test("MongoDB Persistence", False, f"Count mismatch. Expected: {initial_count + 1}, Got: {updated_count}")
            return False

    def test_cors_configuration(self):
        """Test CORS configuration"""
        try:
            # Make a GET request with Origin header to check CORS headers
            response = self.session.get(
                f"{API_BASE}/", 
                headers={'Origin': 'http://localhost:3000'},
                timeout=5
            )
            
            cors_origin = response.headers.get('access-control-allow-origin')
            cors_credentials = response.headers.get('access-control-allow-credentials')
            
            if cors_origin == '*' and cors_credentials == 'true':
                self.log_test("CORS Configuration", True, "CORS properly configured for all origins with credentials")
                return True
            else:
                cors_info = f"Origin: {cors_origin}, Credentials: {cors_credentials}"
                self.log_test("CORS Configuration", False, f"CORS not properly configured - {cors_info}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("CORS Configuration", False, f"CORS test failed: {str(e)}")
            return False

    def test_error_handling(self):
        """Test error handling for invalid requests"""
        # Test invalid JSON for POST endpoint
        try:
            response = self.session.post(
                f"{API_BASE}/status",
                json={"invalid_field": "test"},  # Missing required client_name
                headers={"Content-Type": "application/json"},
                timeout=5
            )
            
            if response.status_code == 422:  # FastAPI validation error
                self.log_test("Error Handling", True, "Properly handles validation errors")
                return True
            else:
                self.log_test("Error Handling", False, f"Expected 422, got {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Error Handling", False, f"Error handling test failed: {str(e)}")
            return False

    def check_missing_game_apis(self):
        """Check for missing APIs that the BigMouthCat game likely needs"""
        expected_endpoints = [
            "/api/taps",           # For tap counting
            "/api/party-rooms",    # For party room system
            "/api/continents",     # For continent selection
            "/api/popwars",        # For PopWars voting
            "/api/leaderboard",    # For leaderboard
            "/api/combos",         # For combo system
            "/api/users",          # For user management
            "/api/realtime"        # For real-time updates
        ]
        
        missing_endpoints = []
        
        for endpoint in expected_endpoints:
            try:
                response = self.session.get(f"{BACKEND_URL}{endpoint}", timeout=2)
                if response.status_code == 404:
                    missing_endpoints.append(endpoint)
            except:
                missing_endpoints.append(endpoint)
        
        if missing_endpoints:
            self.log_test("Game API Coverage", False, f"Missing endpoints: {', '.join(missing_endpoints)}")
            return False
        else:
            self.log_test("Game API Coverage", True, "All expected game endpoints are implemented")
            return True

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting BigMouthCat Backend API Tests")
        print("=" * 60)
        
        # Test server connectivity first
        if not self.test_server_connectivity():
            print("❌ Server not accessible. Stopping tests.")
            return False
        
        # Run core API tests
        tests = [
            self.test_root_endpoint,
            self.test_status_post_endpoint,
            self.test_status_get_endpoint,
            self.test_mongodb_persistence,
            self.test_cors_configuration,
            self.test_error_handling,
            self.check_missing_game_apis
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            try:
                if test():
                    passed += 1
            except Exception as e:
                print(f"❌ Test {test.__name__} crashed: {str(e)}")
        
        print("=" * 60)
        print(f"📊 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("✅ All backend tests passed!")
            return True
        else:
            print(f"❌ {total - passed} tests failed")
            return False

    def generate_summary(self):
        """Generate a summary of test results"""
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print("\n" + "=" * 60)
        print("📋 DETAILED TEST SUMMARY")
        print("=" * 60)
        
        for result in self.test_results:
            status = "✅" if result['success'] else "❌"
            print(f"{status} {result['test']}")
            if result['details']:
                print(f"   {result['details']}")
        
        print(f"\n📊 Overall: {passed}/{total} tests passed")
        return passed, total

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    passed, total = tester.generate_summary()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)