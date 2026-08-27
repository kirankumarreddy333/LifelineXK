import 'dart:convert';

class Donor {
  final String id;
  final String fullName;
  final String bloodGroup;
  final int age;
  final String phone;
  final String city;
  final DateTime lastDonationDate;
  final bool isAvailable;

  Donor({
    required this.id,
    required this.fullName,
    required this.bloodGroup,
    required this.age,
    required this.phone,
    required this.city,
    required this.lastDonationDate,
    required this.isAvailable,
  });

  /// Check if 90 days (approx. 3 months) have passed since the last donation date.
  bool get isEligibleToDonate {
    final difference = DateTime.now().difference(lastDonationDate).inDays;
    return difference >= 90;
  }

  /// Calculates remaining days until next eligible donation date if ineligible.
  int get daysUntilEligible {
    final difference = DateTime.now().difference(lastDonationDate).inDays;
    if (difference >= 90) return 0;
    return 90 - difference;
  }

  Donor copyWith({
    String? id,
    String? fullName,
    String? bloodGroup,
    int? age,
    String? phone,
    String? city,
    DateTime? lastDonationDate,
    bool? isAvailable,
  }) {
    return Donor(
      id: id ?? this.id,
      fullName: fullName ?? this.fullName,
      bloodGroup: bloodGroup ?? this.bloodGroup,
      age: age ?? this.age,
      phone: phone ?? this.phone,
      city: city ?? this.city,
      lastDonationDate: lastDonationDate ?? this.lastDonationDate,
      isAvailable: isAvailable ?? this.isAvailable,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'fullName': fullName,
      'bloodGroup': bloodGroup,
      'age': age,
      'phone': phone,
      'city': city,
      'lastDonationDate': lastDonationDate.toIso8601String(),
      'isAvailable': isAvailable,
    };
  }

  factory Donor.fromMap(Map<String, dynamic> map) {
    return Donor(
      id: map['id'] ?? '',
      fullName: map['fullName'] ?? '',
      bloodGroup: map['bloodGroup'] ?? 'O+',
      age: map['age']?.toInt() ?? 18,
      phone: map['phone'] ?? '',
      city: map['city'] ?? '',
      lastDonationDate: map['lastDonationDate'] != null
          ? DateTime.parse(map['lastDonationDate'])
          : DateTime.now(),
      isAvailable: map['isAvailable'] ?? true,
    );
  }

  String toJson() => json.encode(toMap());

  factory Donor.fromJson(String source) => Donor.fromMap(json.decode(source));
}
