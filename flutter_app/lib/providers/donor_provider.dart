import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/donor.dart';

enum SortOption { name, bloodGroup, age, lastDonation }

class DonorProvider extends ChangeNotifier {
  List<Donor> _donors = [];
  bool _isLoading = false;
  String _searchQuery = '';
  String _selectedBloodGroupFilter = 'All';
  SortOption _currentSortOption = SortOption.name;
  bool _isDarkMode = false;

  static const String _storageKey = 'blood_donors_data_v1';
  static const String _themeKey = 'dark_mode_preference';

  List<Donor> get donors => _donors;
  bool get isLoading => _isLoading;
  String get searchQuery => _searchQuery;
  String get selectedBloodGroupFilter => _selectedBloodGroupFilter;
  SortOption get currentSortOption => _currentSortOption;
  bool get isDarkMode => _isDarkMode;

  DonorProvider() {
    loadDonors();
  }

  /// Filtered and sorted donors list getter based on query, filter, and sorting choice
  List<Donor> get filteredAndSortedDonors {
    List<Donor> list = _donors.where((donor) {
      final query = _searchQuery.toLowerCase().trim();
      final matchesQuery = query.isEmpty ||
          donor.fullName.toLowerCase().contains(query) ||
          donor.bloodGroup.toLowerCase().contains(query) ||
          donor.city.toLowerCase().contains(query) ||
          donor.phone.contains(query);

      final matchesGroup = _selectedBloodGroupFilter == 'All' ||
          donor.bloodGroup == _selectedBloodGroupFilter;

      return matchesQuery && matchesGroup;
    }).toList();

    switch (_currentSortOption) {
      case SortOption.name:
        list.sort((a, b) => a.fullName.toLowerCase().compareTo(b.fullName.toLowerCase()));
        break;
      case SortOption.bloodGroup:
        list.sort((a, b) => a.bloodGroup.compareTo(b.bloodGroup));
        break;
      case SortOption.age:
        list.sort((a, b) => a.age.compareTo(b.age));
        break;
      case SortOption.lastDonation:
        list.sort((a, b) => b.lastDonationDate.compareTo(a.lastDonationDate));
        break;
    }

    return list;
  }

  int get totalDonorsCount => _donors.length;
  int get availableDonorsCount => _donors.where((d) => d.isAvailable).length;

  /// Load donors from SharedPreferences
  Future<void> loadDonors() async {
    _isLoading = true;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      _isDarkMode = prefs.getBool(_themeKey) ?? false;
      final String? jsonString = prefs.getString(_storageKey);

      if (jsonString != null && jsonString.isNotEmpty) {
        final List<dynamic> jsonList = json.decode(jsonString);
        _donors = jsonList.map((item) => Donor.fromMap(item)).toList();
      } else {
        // Seed initial dummy data if first launch
        _donors = _getSeedDonors();
        await _saveToStorage();
      }
    } catch (e) {
      debugPrint('Error loading donors: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Save donors to SharedPreferences
  Future<void> _saveToStorage() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String jsonString = json.encode(_donors.map((d) => d.toMap()).toList());
      await prefs.setString(_storageKey, jsonString);
    } catch (e) {
      debugPrint('Error saving donors: $e');
    }
  }

  /// Add new donor
  Future<void> addDonor(Donor donor) async {
    _donors.insert(0, donor);
    await _saveToStorage();
    notifyListeners();
  }

  /// Update existing donor
  Future<void> updateDonor(Donor updatedDonor) async {
    final index = _donors.indexWhere((d) => d.id == updatedDonor.id);
    if (index != -1) {
      _donors[index] = updatedDonor;
      await _saveToStorage();
      notifyListeners();
    }
  }

  /// Delete donor by ID
  Future<void> deleteDonor(String id) async {
    _donors.removeWhere((d) => d.id == id);
    await _saveToStorage();
    notifyListeners();
  }

  /// Toggle availability status
  Future<void> toggleAvailability(String id) async {
    final index = _donors.indexWhere((d) => d.id == id);
    if (index != -1) {
      _donors[index] = _donors[index].copyWith(
        isAvailable: !_donors[index].isAvailable,
      );
      await _saveToStorage();
      notifyListeners();
    }
  }

  /// Refresh action for pull-to-refresh
  Future<void> refreshDonors() async {
    await loadDonors();
  }

  /// Set Search Query
  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  /// Set Blood Group Filter
  void setBloodGroupFilter(String group) {
    _selectedBloodGroupFilter = group;
    notifyListeners();
  }

  /// Set Sorting Option
  void setSortOption(SortOption option) {
    _currentSortOption = option;
    notifyListeners();
  }

  /// Toggle Dark Mode
  Future<void> toggleDarkMode() async {
    _isDarkMode = !_isDarkMode;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_themeKey, _isDarkMode);
    notifyListeners();
  }

  /// Seed initial donors
  List<Donor> _getSeedDonors() {
    final now = DateTime.now();
    return [
      Donor(
        id: '1',
        fullName: 'Rahul Sharma',
        bloodGroup: 'O+',
        age: 28,
        phone: '9876543210',
        city: 'Mumbai',
        lastDonationDate: now.subtract(const Duration(days: 110)),
        isAvailable: true,
      ),
      Donor(
        id: '2',
        fullName: 'Ananya Verma',
        bloodGroup: 'A-',
        age: 24,
        phone: '9123456789',
        city: 'Delhi',
        lastDonationDate: now.subtract(const Duration(days: 45)),
        isAvailable: false,
      ),
      Donor(
        id: '3',
        fullName: 'Vikram Patel',
        bloodGroup: 'B+',
        age: 32,
        phone: '9988776655',
        city: 'Ahmedabad',
        lastDonationDate: now.subtract(const Duration(days: 120)),
        isAvailable: true,
      ),
    ];
  }
}
