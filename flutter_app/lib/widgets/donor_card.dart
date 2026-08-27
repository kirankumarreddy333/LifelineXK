import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/donor.dart';
import 'blood_badge.dart';
import 'primary_button.dart';

class DonorCard extends StatefulWidget {
  final Donor donor;
  final VoidCallback onDelete;
  final VoidCallback onEdit;
  final VoidCallback onToggleAvailability;

  const DonorCard({
    super.key,
    required this.donor,
    required this.onDelete,
    required this.onEdit,
    required this.onToggleAvailability,
  });

  @override
  State<DonorCard> createState() => _DonorCardState();
}

class _DonorCardState extends State<DonorCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 350),
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeOut),
    );
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.08),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeOut),
    );
    _animController.forward();
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const primaryRed = Color(0xFFDC2626);
    const darkText = Color(0xFF111827);
    final donor = widget.donor;
    final formattedDate = DateFormat('MMM dd, yyyy').format(donor.lastDonationDate);

    return SlideTransition(
      position: _slideAnimation,
      child: FadeTransition(
        opacity: _fadeAnimation,
        child: Container(
          margin: const EdgeInsets.only(top: 16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: const [
              BoxShadow(
                color: Color.fromRGBO(0, 0, 0, 0.08),
                blurRadius: 15,
                offset: Offset(0, 5),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Container(
              decoration: const BoxDecoration(
                border: Border(
                  left: BorderSide(
                    color: primaryRed,
                    width: 6,
                  ),
                ),
              ),
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAlignment.start,
                children: [
                  // Top Row: Name, Blood Group Badge, and Edit Icon
                  Row(
                    crossAxisAlignment: CrossAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAlignment.start,
                          children: [
                            Text(
                              donor.fullName,
                              style: const TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                                color: primaryRed,
                                height: 1.2,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                Icon(
                                  donor.isAvailable
                                      ? Icons.check_circle
                                      : Icons.cancel,
                                  size: 16,
                                  color: donor.isAvailable
                                      ? Colors.green.shade700
                                      : Colors.grey.shade600,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  donor.isAvailable
                                      ? 'Available to Donate'
                                      : 'Currently Unavailable',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: donor.isAvailable
                                        ? Colors.green.shade700
                                        : Colors.grey.shade600,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      BloodBadge(bloodGroup: donor.bloodGroup),
                      IconButton(
                        icon: const Icon(Icons.edit_outlined, color: darkText),
                        tooltip: 'Edit Donor',
                        onPressed: widget.onEdit,
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Eligibility Reminder Chip
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: donor.isEligibleToDonate
                          ? Colors.green.shade50
                          : Colors.amber.shade50,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: donor.isEligibleToDonate
                            ? Colors.green.shade200
                            : Colors.amber.shade200,
                      ),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          donor.isEligibleToDonate
                              ? Icons.verified
                              : Icons.schedule,
                          size: 18,
                          color: donor.isEligibleToDonate
                              ? Colors.green.shade800
                              : Colors.amber.shade900,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            donor.isEligibleToDonate
                                ? 'Eligible for donation (90+ days since last donation)'
                                : 'Ineligible: ${donor.daysUntilEligible} days remaining before next eligible donation.',
                            style: TextStyle(
                              fontSize: 12.5,
                              fontWeight: FontWeight.w600,
                              color: donor.isEligibleToDonate
                                  ? Colors.green.shade900
                                  : Colors.amber.shade900,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Details Grid
                  Wrap(
                    spacing: 20,
                    runSpacing: 8,
                    children: [
                      _DetailTile(
                        icon: Icons.cake_outlined,
                        label: 'Age',
                        value: '${donor.age} yrs',
                      ),
                      _DetailTile(
                        icon: Icons.phone_outlined,
                        label: 'Phone',
                        value: donor.phone,
                      ),
                      _DetailTile(
                        icon: Icons.location_on_outlined,
                        label: 'City',
                        value: donor.city,
                      ),
                      _DetailTile(
                        icon: Icons.calendar_month_outlined,
                        label: 'Last Donation',
                        value: formattedDate,
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Dark Delete Button
                  PrimaryButton(
                    text: 'Delete Donor',
                    variant: ButtonVariant.dark,
                    icon: Icons.delete_outline,
                    onPressed: widget.onDelete,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _DetailTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _DetailTile({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    const darkText = Color(0xFF111827);

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 18, color: Colors.grey.shade700),
        const SizedBox(width: 6),
        Text(
          '$label: ',
          style: TextStyle(
            fontSize: 14,
            color: Colors.grey.shade700,
            fontWeight: FontWeight.w500,
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: darkText,
          ),
        ),
      ],
    );
  }
}
