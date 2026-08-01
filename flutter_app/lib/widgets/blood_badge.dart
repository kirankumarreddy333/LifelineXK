import 'package:flutter/material.dart';

class BloodBadge extends StatelessWidget {
  final String bloodGroup;
  final double fontSize;

  const BloodBadge({
    super.key,
    required this.bloodGroup,
    this.fontSize = 16,
  });

  @override
  Widget build(BuildContext context) {
    const primaryRed = Color(0xFFDC2626);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: primaryRed.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: primaryRed.withOpacity(0.3), width: 1.5),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(
            Icons.water_drop,
            color: primaryRed,
            size: 18,
          ),
          const SizedBox(width: 4),
          Text(
            bloodGroup,
            style: TextStyle(
              color: primaryRed,
              fontWeight: FontWeight.w800,
              fontSize: fontSize,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }
}
