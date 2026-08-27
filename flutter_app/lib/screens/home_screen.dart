import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../models/donor.dart';
import '../providers/donor_provider.dart';
import '../widgets/custom_text_field.dart';
import '../widgets/primary_button.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _ageController = TextEditingController();
  final _phoneController = TextEditingController();
  final _cityController = TextEditingController();

  String _selectedBloodGroup = 'A+';
  DateTime? _selectedDate;
  bool _isAvailable = true;
  bool _isSubmitting = false;

  final List<String> _bloodGroups = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _ageController.dispose();
    _phoneController.dispose();
    _cityController.dispose();
    super.dispose();
  }

  Future<void> _selectDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate ?? DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime.now(),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: Color(0xFFDC2626),
              onPrimary: Colors.white,
              onSurface: Color(0xFF111827),
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedDate == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select the last donation date'),
          backgroundColor: Colors.redAccent,
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      final donorProvider = Provider.of<DonorProvider>(context, listen: false);
      final newDonor = Donor(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        fullName: _nameController.text.trim(),
        bloodGroup: _selectedBloodGroup,
        age: int.parse(_ageController.text.trim()),
        phone: _phoneController.text.trim(),
        city: _cityController.text.trim(),
        lastDonationDate: _selectedDate!,
        isAvailable: _isAvailable,
      );

      await donorProvider.addDonor(newDonor);

      if (!mounted) return;

      // Show Success Dialog / SnackBar
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: const [
              Icon(Icons.check_circle, color: Colors.white),
              SizedBox(width: 10),
              Text('Donor registered successfully!'),
            ],
          ),
          backgroundColor: Colors.green.shade700,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      );

      // Form Reset
      _formKey.currentState!.reset();
      _nameController.clear();
      _ageController.clear();
      _phoneController.clear();
      _cityController.clear();
      setState(() {
        _selectedBloodGroup = 'A+';
        _selectedDate = null;
        _isAvailable = true;
      });
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to register donor: $e'),
          backgroundColor: const Color(0xFFDC2626),
        ),
      );
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    const primaryRed = Color(0xFFDC2626);
    const darkText = Color(0xFF111827);

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Blood Donor Portal',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        actions: [
          Consumer<DonorProvider>(
            builder: (context, provider, _) {
              return IconButton(
                icon: Icon(
                  provider.isDarkMode ? Icons.light_mode : Icons.dark_mode,
                ),
                tooltip: 'Toggle Theme',
                onPressed: () => provider.toggleDarkMode(),
              );
            },
          ),
          TextButton.icon(
            onPressed: () => context.go('/donors'),
            icon: const Icon(Icons.people, color: Colors.white),
            label: const Text(
              'Donor List',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 30),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 700),
            child: Column(
              crossAxisAlignment: CrossAlignment.center,
              children: [
                // Heading
                const Text(
                  'Blood Donor Management',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: primaryRed,
                    fontSize: 38,
                    fontWeight: FontWeight.w800,
                    height: 1.3,
                    letterSpacing: 1.0,
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  'Register new blood donors and save lives',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey.shade700,
                  ),
                ),
                const SizedBox(height: 35),

                // Form Container Card
                Container(
                  padding: const EdgeInsets.all(30),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(15),
                    boxShadow: const [
                      BoxShadow(
                        color: Color.fromRGBO(0, 0, 0, 0.1),
                        blurRadius: 20,
                        offset: Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAlignment.start,
                      children: [
                        const Text(
                          'Donor Registration Form',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: primaryRed,
                          ),
                        ),
                        const SizedBox(height: 20),

                        // Full Name
                        CustomTextField(
                          label: 'Full Name',
                          hint: 'Enter full name',
                          controller: _nameController,
                          prefixIcon: Icons.person_outline,
                          validator: (val) {
                            if (val == null || val.trim().isEmpty) {
                              return 'Full name is required';
                            }
                            return null;
                          },
                        ),

                        // Blood Group Dropdown
                        const Padding(
                          padding: EdgeInsets.only(top: 8.0, bottom: 6.0),
                          child: Text(
                            'Blood Group',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: darkText,
                            ),
                          ),
                        ),
                        DropdownButtonFormField<String>(
                          value: _selectedBloodGroup,
                          decoration: InputDecoration(
                            filled: true,
                            fillColor: Colors.white,
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 14,
                            ),
                            prefixIcon: const Icon(
                              Icons.water_drop,
                              color: primaryRed,
                            ),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                              borderSide: const BorderSide(color: Color(0xFFDDDDDD)),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                              borderSide: const BorderSide(color: Color(0xFFDDDDDD)),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                              borderSide: const BorderSide(
                                color: primaryRed,
                                width: 2,
                              ),
                            ),
                          ),
                          items: _bloodGroups.map((group) {
                            return DropdownMenuItem(
                              value: group,
                              child: Text(
                                group,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: darkText,
                                ),
                              ),
                            );
                          }).toList(),
                          onChanged: (val) {
                            if (val != null) {
                              setState(() => _selectedBloodGroup = val);
                            }
                          },
                        ),
                        const SizedBox(height: 8),

                        // Age
                        CustomTextField(
                          label: 'Age',
                          hint: 'Enter age (18-70)',
                          controller: _ageController,
                          keyboardType: TextInputType.number,
                          prefixIcon: Icons.cake_outlined,
                          validator: (val) {
                            if (val == null || val.trim().isEmpty) {
                              return 'Age is required';
                            }
                            final age = int.tryParse(val.trim());
                            if (age == null || age < 18 || age > 70) {
                              return 'Age must be between 18 and 70';
                            }
                            return null;
                          },
                        ),

                        // Phone Number
                        CustomTextField(
                          label: 'Phone Number',
                          hint: 'Enter 10-digit phone number',
                          controller: _phoneController,
                          keyboardType: TextInputType.phone,
                          prefixIcon: Icons.phone_outlined,
                          validator: (val) {
                            if (val == null || val.trim().isEmpty) {
                              return 'Phone number is required';
                            }
                            if (val.trim().length < 10) {
                              return 'Phone number must be at least 10 digits';
                            }
                            return null;
                          },
                        ),

                        // City
                        CustomTextField(
                          label: 'City',
                          hint: 'Enter city',
                          controller: _cityController,
                          prefixIcon: Icons.location_city_outlined,
                          validator: (val) {
                            if (val == null || val.trim().isEmpty) {
                              return 'City is required';
                            }
                            return null;
                          },
                        ),

                        // Last Donation Date Picker
                        const Padding(
                          padding: EdgeInsets.only(top: 8.0, bottom: 6.0),
                          child: Text(
                            'Last Donation Date',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: darkText,
                            ),
                          ),
                        ),
                        InkWell(
                          onTap: _selectDate,
                          child: Container(
                            width: double.infinity,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 14,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: _selectedDate == null
                                    ? const Color(0xFFDDDDDD)
                                    : primaryRed,
                              ),
                            ),
                            child: Row(
                              children: [
                                const Icon(
                                  Icons.calendar_month_outlined,
                                  color: primaryRed,
                                ),
                                const SizedBox(width: 12),
                                Text(
                                  _selectedDate == null
                                      ? 'Select Date (YYYY-MM-DD)'
                                      : DateFormat('yyyy-MM-DD')
                                          .format(_selectedDate!),
                                  style: TextStyle(
                                    fontSize: 16,
                                    color: _selectedDate == null
                                        ? Colors.grey.shade400
                                        : darkText,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 14),

                        // Availability Status Switch
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFFF5F5),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAlignment.start,
                                children: [
                                  const Text(
                                    'Availability Status',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: darkText,
                                    ),
                                  ),
                                  Text(
                                    _isAvailable
                                        ? 'Ready to donate immediately'
                                        : 'Currently unavailable for donation',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey.shade600,
                                    ),
                                  ),
                                ],
                              ),
                              Switch.adaptive(
                                value: _isAvailable,
                                activeColor: primaryRed,
                                onChanged: (val) {
                                  setState(() => _isAvailable = val);
                                },
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 24),

                        // Red Submit Button
                        PrimaryButton(
                          text: 'Register Donor',
                          isLoading: _isSubmitting,
                          onPressed: _submitForm,
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Link to view list
                OutlinedButton.icon(
                  onPressed: () => context.go('/donors'),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: primaryRed, width: 1.5),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 14,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  icon: const Icon(Icons.list_alt, color: primaryRed),
                  label: const Text(
                    'View Registered Donors List',
                    style: TextStyle(
                      color: primaryRed,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
