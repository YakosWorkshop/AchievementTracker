from django.db import models


class Platform(models.Model):
    system = models.CharField(max_length=1000, unique=True)

    class Meta:
        db_table = "platform"


class Game(models.Model):
    external_id = models.CharField(max_length=1000)
    platform = models.ForeignKey(Platform, on_delete=models.CASCADE)
    title = models.CharField(max_length=1000)
    detail = models.TextField()
    icon = models.ImageField()

    class Meta:
        db_table = "game"
        constraints = [
            models.UniqueConstraint(
                fields=["platform_id", "external_id"], name="unique_game_per_platform"
            )
        ]


class AchievementGrade(models.TextChoices):
    BRONZE = "bronze", "Bronze"
    SILVER = "silver", "Silver"
    GOLD = "gold", "Gold"
    PLATINUM = "platinum", "Platinum"


class Achievement(models.Model):
    game = models.ForeignKey(
        Game, on_delete=models.CASCADE, related_name="achievements"
    )
    name = models.CharField(max_length=100)
    description = models.TextField()
    hidden = models.BooleanField()
    icon = models.ImageField()
    external_id = models.IntegerField()
    grade = models.CharField(
        max_length=8,
        choices=AchievementGrade.choices,
        blank=True,
        default="",
    )

    class Meta:
        db_table = "achievements"


class UnlockedAchievement(models.Model):
    achievements = models.OneToOneField(
        Achievement,
        on_delete=models.CASCADE,
    )
    time_unlocked = models.DateTimeField()

    class Meta:
        db_table = "unlocked_achievements"
